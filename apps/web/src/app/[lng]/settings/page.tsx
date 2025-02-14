'use client';

import Navbar from '@/components/Layout/Navbar';
import Radio from '@/components/Radio/Radio';
import { CACHE_BACKUP_KEY, LAWALLET_VERSION, STORAGE_IDENTITY_KEY } from '@/constants/constants';
import { useTranslation } from '@/context/TranslateContext';
import useErrors from '@/hooks/useErrors';
import {
  Button,
  ButtonSetting,
  Container,
  Divider,
  Feedback,
  Flex,
  Icon,
  LinkSetting,
  Sheet,
  Text,
} from '@lawallet/ui';

import { appTheme } from '@/config';
import { CaretRightIcon } from '@bitcoin-design/bitcoin-icons-react/filled';
import { useConfig, useWalletContext } from '@lawallet/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const config = useConfig();
  const { lng, t, changeLanguage } = useTranslation();

  const {
    account: { identity },
  } = useWalletContext();

  const [sheetLanguage, setSheetLanguage] = useState<boolean>(false);
  const router: AppRouterInstance = useRouter();
  const errors = useErrors();

  const logoutSession = () => {
    const cachedBackup = config.storage.getItem(`${CACHE_BACKUP_KEY}_${identity.data.hexpub}`);

    if (!cachedBackup) {
      errors.modifyError('ERROR_MADE_BACKUP');
      return;
    }

    const confirmation: boolean = confirm(t('CONFIRM_LOGOUT'));

    if (confirmation) {
      config.storage.removeItem(STORAGE_IDENTITY_KEY);
      identity.resetIdentity();
      router.push('/login');
    }
  };

  return (
    <>
      <Navbar showBackPage={true} title={t('SETTINGS')} overrideBack="/dashboard" />

      <Container size="small">
        <Divider y={16} />
        <Text size="small" color={appTheme.colors.gray50}>
          {t('ACCOUNT')}
        </Text>
        <Divider y={8} />
        <Flex direction="column" gap={4}>
          <LinkSetting onClick={() => router.push('/settings/cards')}>{t('MY_CARDS')}</LinkSetting>
        </Flex>
        <Divider y={8} />

        <Flex direction="column" gap={4}>
          <ButtonSetting onClick={() => setSheetLanguage(!sheetLanguage)}>
            {t('LANGUAGE')}

            <Flex flex={1} align="end" justify="end">
              <Text isBold={true}>{lng.toUpperCase()}</Text>
            </Flex>

            <Icon size="small" color={appTheme.colors.gray40}>
              <CaretRightIcon />
            </Icon>
          </ButtonSetting>
        </Flex>

        {Boolean(identity.data.privateKey.length) && (
          <>
            <Divider y={16} />
            <Text size="small" color={appTheme.colors.gray50}>
              {t('SECURITY')}
            </Text>
            <Divider y={8} />
            <Flex direction="column" gap={4}>
              <LinkSetting onClick={() => router.push('/settings/recovery')}>{t('BACKUP_ACCOUNT')}</LinkSetting>
            </Flex>
          </>
        )}

        <Divider y={16} />
        <Text size="small" color={appTheme.colors.gray50}>
          {t('ABOUT_US')}
        </Text>
        <Divider y={8} />
        <Flex direction="column" gap={4}>
          <LinkSetting onClick={() => router.push('https://twitter.com/lawalletok')}>Twitter</LinkSetting>
          <LinkSetting onClick={() => router.push('https://discord.lacrypta.ar')}>Discord</LinkSetting>
        </Flex>
        <Divider y={16} />
        <Flex justify="center">
          <Text size="small" color={appTheme.colors.gray50}>
            LaWallet {LAWALLET_VERSION}
          </Text>
        </Flex>
        <Divider y={16} />

        <Feedback show={errors.errorInfo.visible} status={'error'}>
          <Flex flex={1} align="center" justify="center">
            {errors.errorInfo.text}
          </Flex>

          <Divider y={16} />
        </Feedback>

        <Flex>
          <Button color="error" variant="bezeled" onClick={logoutSession}>
            {t('LOGOUT')}
          </Button>
        </Flex>
        <Divider y={16} />
      </Container>

      <Sheet
        title={t('CHANGE_LANGUAGE')}
        isOpen={sheetLanguage}
        closeText={t('CLOSE')}
        onClose={() => setSheetLanguage(false)}
      >
        <Container>
          <Flex direction="column" flex={1}>
            <Radio
              text={t('ENGLISH')}
              checked={lng === 'en'}
              onClick={() => {
                if (lng !== 'en') changeLanguage('en');
              }}
            />

            <Radio
              text={t('SPANISH')}
              checked={lng === 'es'}
              onClick={() => {
                if (lng !== 'es') changeLanguage('es');
              }}
            />
          </Flex>
        </Container>
      </Sheet>
    </>
  );
}
