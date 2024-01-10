import {
  NDKEvent,
  NDKKind,
  NDKPrivateKeySigner,
  type NDKTag,
  type NostrEvent
} from '@nostr-dev-kit/ndk'
import {
  type UnsignedEvent,
  getEventHash,
  getPublicKey,
  getSignature,
  nip26
} from 'nostr-tools'
import { type TransferInformation } from '../interceptors/transaction.js'
import { type CardConfigPayload, ConfigTypes } from '../types/card.js'
import { type ConfigProps } from '../types/config.js'
import { type UserIdentity } from '../types/identity.js'
import { buildMultiNip04Event } from './nip04.js'
import { nowInSeconds } from './utilities.js'
import { baseConfig } from '../constants/constants.js'

export enum LaWalletKinds {
  REGULAR = 1112,
  EPHEMERAL = 21111,
  PARAMETRIZED_REPLACEABLE = 31111
}

export enum LaWalletTags {
  INTERNAL_TRANSACTION_START = 'internal-transaction-start',
  INTERNAL_TRANSACTION_OK = 'internal-transaction-ok',
  INTERNAL_TRANSACTION_ERROR = 'internal-transaction-error',
  INBOUND_TRANSACTION_START = 'inbound-transaction-start',
  INBOUND_TRANSACTION_OK = 'inbound-transaction-ok',
  INBOUND_TRANSACTION_ERROR = 'inbound-transaction-error',
  OUTBOUND_TRANSACTION_OK = 'outbound-transaction-ok',
  OUTBOUND_TRANSACTION_ERROR = 'outbound-transaction-error',
  CREATE_IDENTITY = 'create-identity',
  CARD_ACTIVATION_REQUEST = 'card-activation-request'
}

export type GenerateIdentityReturns = {
  identity: UserIdentity
  event: NostrEvent
}

export const getTag = (tags: NDKTag[], keyTag: string) => {
  const tagValue = tags.find(tag => tag[0] === keyTag)
  return tagValue ? tagValue[1] : ''
}

export const getMultipleTags = (tags: NDKTag[], keyTag: string) => {
  const values: string[] = []

  const tagsValue: NDKTag[] = tags.filter(tag => tag[0] === keyTag)
  tagsValue.forEach(tag => values.push(tag[1]!))

  return values
}

export const buildIdentityEvent = async (
  nonce: string,
  identity: UserIdentity
): Promise<NostrEvent> => {
  const signer = new NDKPrivateKeySigner(identity.privateKey)
  const event: NDKEvent = new NDKEvent()
  event.pubkey = identity.hexpub
  event.kind = LaWalletKinds.REGULAR

  event.content = JSON.stringify({
    name: identity.username,
    pubkey: identity.hexpub
  })

  event.tags = [
    ['t', LaWalletTags.CREATE_IDENTITY],
    ['name', identity.username],
    ['nonce', nonce]
  ]

  await event.sign(signer)
  return event.toNostrEvent()
}

export const buildCardActivationEvent = async (
  otc: string,
  privateKey: string,
  config: ConfigProps = baseConfig
): Promise<NostrEvent> => {
  const signer = new NDKPrivateKeySigner(privateKey)
  const userPubkey: string = getPublicKey(privateKey)

  const delegation = nip26.createDelegation(privateKey, {
    pubkey: config.modulePubkeys.card,
    kind: LaWalletKinds.REGULAR,
    since: Math.floor(Date.now() / 1000) - 36000,
    until: Math.floor(Date.now() / 1000) + 3600 * 24 * 30 * 12
  })

  const event: NDKEvent = new NDKEvent()
  event.pubkey = userPubkey
  event.kind = LaWalletKinds.EPHEMERAL

  event.content = JSON.stringify({
    otc,
    delegation: {
      conditions: delegation.cond,
      token: delegation.sig
    }
  })

  event.tags = [
    ['p', config.modulePubkeys.card],
    ['t', LaWalletTags.CARD_ACTIVATION_REQUEST]
  ]

  await event.sign(signer)
  return event.toNostrEvent()
}

export const buildZapRequestEvent = async (
  amount: number,
  privateKey: string,
  config: ConfigProps = baseConfig
) => {
  const signer = new NDKPrivateKeySigner(privateKey)
  const userPubkey: string = getPublicKey(privateKey)

  const zapEvent: NDKEvent = new NDKEvent()
  zapEvent.pubkey = userPubkey
  zapEvent.kind = NDKKind.ZapRequest

  zapEvent.tags = [
    ['p', userPubkey],
    ['amount', amount.toString()],
    ['relays', ...config.relaysList]
  ]

  await zapEvent.sign(signer)

  const requestEvent: string = encodeURI(
    JSON.stringify(await zapEvent.toNostrEvent())
  )
  return requestEvent
}

export const buildTxStartEvent = async (
  tokenName: string,
  transferInfo: TransferInformation,
  tags: NDKTag[],
  privateKey: string,
  config: ConfigProps = baseConfig
): Promise<NostrEvent> => {
  const signer = new NDKPrivateKeySigner(privateKey)
  const userPubkey = getPublicKey(privateKey)

  const internalEvent: NDKEvent = new NDKEvent()
  internalEvent.pubkey = userPubkey
  internalEvent.kind = LaWalletKinds.REGULAR

  internalEvent.content = JSON.stringify({
    tokens: { [tokenName]: (transferInfo.amount * 1000).toString() },
    memo: transferInfo.comment
  })

  internalEvent.tags = [
    ['t', LaWalletTags.INTERNAL_TRANSACTION_START],
    ['p', config.modulePubkeys.ledger],
    ['p', transferInfo.receiverPubkey]
  ]

  if (tags.length) internalEvent.tags = [...internalEvent.tags, ...tags]

  await internalEvent.sign(signer!)
  const event: NostrEvent = await internalEvent.toNostrEvent()
  return event
}

export const buildCardInfoRequest = async (
  subkind: string,
  privateKey: string
) => {
  const userPubkey: string = getPublicKey(privateKey)

  const event: NostrEvent = {
    content: '',
    pubkey: userPubkey,
    created_at: nowInSeconds(),
    kind: LaWalletKinds.PARAMETRIZED_REPLACEABLE,
    tags: [['t', subkind]]
  }

  event.id = getEventHash(event as UnsignedEvent)
  event.sig = getSignature(event as UnsignedEvent, privateKey)

  return event
}

export const buildCardConfigEvent = async (
  cardConfig: CardConfigPayload,
  privateKey: string,
  config: ConfigProps = baseConfig
): Promise<NostrEvent> => {
  const userPubkey: string = getPublicKey(privateKey)
  const event: NostrEvent = await buildMultiNip04Event(
    JSON.stringify(cardConfig),
    privateKey,
    userPubkey,
    [config.modulePubkeys.card, userPubkey]
  )

  event.kind = LaWalletKinds.REGULAR

  event.tags = event.tags.concat([
    ['t', `${ConfigTypes.CONFIG.valueOf()}-change`]
  ])

  event.id = getEventHash(event as UnsignedEvent)
  event.sig = getSignature(event as UnsignedEvent, privateKey)

  return event
}
