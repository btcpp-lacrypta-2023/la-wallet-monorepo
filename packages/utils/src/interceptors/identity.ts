import { type NostrEvent } from '@nostr-dev-kit/ndk';
import { generatePrivateKey, getPublicKey, nip19 } from 'nostr-tools';
import { type ConfigProps } from '../types/config.js';
import { type UserIdentity } from '../types/identity.js';
import { baseConfig } from '../constants/constants.js';

export type IdentityResponse = {
  success: boolean;
  name?: string;
  pubkey?: string;
  reason?: string;
  error?: string;
};

export const generateUserIdentity = async (name?: string): Promise<UserIdentity> => {
  const privateKey = generatePrivateKey();
  const identityPubKey = getPublicKey(privateKey);

  const identity: UserIdentity = {
    username: name ?? '',
    hexpub: identityPubKey,
    npub: nip19.npubEncode(identityPubKey),
    privateKey: privateKey,
  };

  return identity;
};

export const validateNonce = async (nonce: string, config: ConfigProps = baseConfig): Promise<boolean> => {
  return fetch(`${config.endpoints.lightningDomain}/api/nonce/${nonce}`)
    .then((res) => res.json())
    .then((response) => {
      if (!response || !response.status) return false;

      return response.status;
    })
    .catch(() => false);
};

export const claimIdentity = async (event: NostrEvent, config: ConfigProps = baseConfig): Promise<IdentityResponse> => {
  return fetch(`${config.endpoints.lightningDomain}/api/identity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })
    .then((res) => res.json())
    .then((response: Partial<IdentityResponse>) => {
      if (response && response.pubkey) {
        return { success: true, pubkey: response.pubkey };
      }

      return {
        success: false,
        reason: response.error ? response.error : 'ERROR_ON_CREATE_ACCOUNT',
      };
    })
    .catch((err) => {
      return { success: false, reason: (err as Error).message };
    });
};

export const getUsername = (pubkey: string, config: ConfigProps = baseConfig) => {
  const storagedUsername: string = (config.storage.getItem(`${config.federationId}_${pubkey}`) as string) || '';
  if (storagedUsername.length) return storagedUsername;

  return fetch(`${config.endpoints.lightningDomain}/api/pubkey/${pubkey}`)
    .then((res) => res.json())
    .then((info) => {
      if (!info || !info.username) return '';

      config.storage.setItem(`${config.federationId}_${pubkey}`, info.username);
      return info.username;
    })
    .catch(() => '');
};

export const getUserPubkey = (username: string, config: ConfigProps = baseConfig) =>
  fetch(`${config.endpoints.lightningDomain}/api/lud16/${username}`)
    .then((res) => res.json())
    .then((info) => info.accountPubKey ?? '')
    .catch(() => '');

export const existIdentity = async (name: string, config: ConfigProps = baseConfig): Promise<boolean> => {
  try {
    const response = await fetch(`${config.endpoints.lightningDomain}/api/identity?name=${name}`);
    return response.status === 200;
  } catch {
    return false;
  }
};
