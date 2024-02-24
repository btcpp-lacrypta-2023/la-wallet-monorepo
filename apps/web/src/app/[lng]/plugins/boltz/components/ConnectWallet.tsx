'use client';
import { appTheme } from '@/config';
import { useTranslation } from '@/context/TranslateContext';
import { Container, Divider, Flex, Text } from '@lawallet/ui';
import { ConnectButton, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import ConnectSVG from './ConnectSVG';

const ConnectWallet = () => {
  const { t } = useTranslation();

  return (
    <Flex flex={1} justify="center" align="center">
      <RainbowKitProvider modalSize="compact">
        <Container size="small">
          <Flex flex={1} direction="column" align="center" justify="center" gap={8}>
            <ConnectSVG />

            <Flex direction="column" gap={4} align="center">
              <Text isBold={true}>{t('NOT_CONNECTED_WALLET')}</Text>
              <Text size="small" color={appTheme.colors.gray50}>
                {t('CONNECT_WALLET_NEEDED')}
              </Text>

              <Divider y={24} />

              <ConnectButton />
            </Flex>
          </Flex>
          <Divider y={24} />
        </Container>
      </RainbowKitProvider>
    </Flex>
  );
};

export default ConnectWallet;
