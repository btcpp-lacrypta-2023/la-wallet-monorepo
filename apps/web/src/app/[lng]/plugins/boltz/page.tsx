'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import Navbar from '@/components/Layout/Navbar';
import { TokenList } from '@/components/TokenList';
import { appTheme } from '@/config';
import { useTranslation } from '@/context/TranslateContext';
import { SatoshiV2Icon } from '@bitcoin-design/bitcoin-icons-react/filled';
import { formatToPreference, useWalletContext } from '@lawallet/react';
import {
  BtnLoader,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HeroCard,
  Icon,
  ReceiveIcon,
  SendIcon,
  Text,
} from '@lawallet/ui';
import { useAccount } from 'wagmi';
import ConnectWallet from './components/ConnectWallet';
import DepositSheet from './components/DepositSheet';

export default function Page() {
  const router = useRouter();
  const [showSheet, setShowSheet] = useState(false);
  const { isConnected } = useAccount();

  const { t, lng } = useTranslation();

  const {
    account: { balance },
    settings: {
      loading,
      props: { hideBalance, currency },
    },
    converter: { pricesData, convertCurrency },
  } = useWalletContext();

  const convertedBalance: string = useMemo(() => {
    const amount: number = convertCurrency(balance.amount, 'SAT', currency);
    return formatToPreference(currency, amount, lng);
  }, [balance, pricesData, currency]);

  return (
    <>
      <Navbar title={'Boltz'} showBackPage={true} />

      {isConnected ? (
        <>
          <HeroCard>
            <Divider y={8} />
            <Flex direction="column" align="center" justify="start" flex={1}>
              <Text size="small" color={appTheme.colors.gray50}>
                {t('BALANCE')}
              </Text>
              <Divider y={8} />
              <Flex justify="center" align="center" gap={4}>
                <Flex justify="center" align="center" gap={4}>
                  {!hideBalance ? (
                    <>
                      {currency === 'SAT' ? (
                        <Icon size="small">
                          <SatoshiV2Icon />
                        </Icon>
                      ) : (
                        <Text>$</Text>
                      )}
                    </>
                  ) : null}

                  <Heading>
                    {loading || balance.loading ? <BtnLoader /> : hideBalance ? '*****' : convertedBalance}
                  </Heading>
                </Flex>
              </Flex>
              <Divider y={8} />

              {!loading && <TokenList />}
            </Flex>

            <Divider y={12} />

            <Container size="small">
              <Flex flex={1} gap={8} justify="start" align="start">
                <Button onClick={() => setShowSheet(true)}>
                  <Icon>
                    <ReceiveIcon />
                  </Icon>
                  {t('DEPOSIT')}
                </Button>
                <Button color="secondary" onClick={() => router.push('/plugins/boltz/withdraw')}>
                  <Icon>
                    <SendIcon />
                  </Icon>
                  {t('EXTRACT')}
                </Button>
              </Flex>
              <Divider y={16} />
            </Container>
          </HeroCard>

          <Divider y={16} />

          <Container size="small">
            <Flex justify="start" align="center">
              <Text size="small" color={appTheme.colors.gray50}>
                {t('LAST_ACTIVITY').toUpperCase()}
              </Text>
            </Flex>

            <Divider y={16} />
            <Divider y={16} />
            <Flex flex={1} direction="column" align="center">
              <Text>You havent made any swaps</Text>
            </Flex>
          </Container>

          <DepositSheet isOpen={showSheet} handleCopy={() => null} onClose={() => setShowSheet(false)} />
        </>
      ) : (
        <ConnectWallet />
      )}
    </>
  );
}
