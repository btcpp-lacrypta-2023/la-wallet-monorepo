'use client';

import { useState } from 'react';
import { useTheme } from 'styled-components';

import Navbar from '@/components/Layout/Navbar';
import { Container, Divider, Flex, Text, Button, Icon, Heading, LinkButton, Card, ToggleSwitch } from '@lawallet/ui';
import { SatoshiV2Icon } from '@bitcoin-design/bitcoin-icons-react/filled';
import router from 'next/router';
import { useWalletContext } from '@lawallet/react';
import { useTranslation } from '@/context/TranslateContext';

export default function Page() {
  const theme = useTheme();
  const { t } = useTranslation();

  const [commissionAccepted, setCommissionAccepted] = useState(false);

  const {
    settings: {
      props: { currency },
    },
  } = useWalletContext();

  const handleSwitch = () => {
    setCommissionAccepted(!commissionAccepted);
  };

  return (
    <>
      <Navbar title={'Validate info'} showBackPage={true} />

      <Container size="small">
        {/* <CardWithData type={type} data={data} /> */}
        <Divider y={16} />
        <Flex direction="column" flex={1} justify="center" align="center" gap={8}>
          <Heading as="h6">A extraer</Heading>

          {/* {Number(convertedAmount) !== 0 ? ( */}
          <Flex align="center" justify="center" gap={4}>
            {currency === 'SAT' ? (
              <Icon size="small">
                <SatoshiV2Icon />
              </Icon>
            ) : (
              <Text>$</Text>
            )}
            <Heading>{'convertedAmount'}</Heading>
            <Text>{currency}</Text>
          </Flex>
          {/* ) : (
            <Flex align="center" justify="center" gap={4}>
              <Icon size="small">
                <SatoshiV2Icon />
              </Icon>
              <Heading>{'amount'}</Heading>
              <Text>SAT</Text>
            </Flex>
          )} */}
        </Flex>
        <Divider y={16} />
        <Card>
          <Flex direction="column" gap={8}>
            <Text size="small" color={theme.colors.gray50}>
              Debido a la comision de la red, sumado a la comision de 0.1% que cobra Boltz, el total final es de...
            </Text>
            <Flex justify="space-between" align="center">
              <div>
                <Flex align="end" gap={4}>
                  <Text>Total</Text>
                  <Text isBold>$4.50 {currency}</Text>
                  {/* <Text size="small" color={theme.colors.gray50}>
                    {currency}
                  </Text> */}
                </Flex>
              </div>
              <ToggleSwitch switchEnabled={commissionAccepted} onChange={handleSwitch} />
            </Flex>
          </Flex>
        </Card>
        <Divider y={16} />
      </Container>

      {/* {expired || (type !== TransferTypes.LNURLW && !balance.loading && insufficientBalance) ? (
        <Flex flex={1} align="center" justify="center">
          <Feedback show={true} status={'error'}>
            {expired ? t('INVOICE_EXPIRED') : t('INSUFFICIENT_BALANCE')}
          </Feedback>
        </Flex>
      ) : null} */}

      <Flex>
        <Container size="small">
          <Divider y={16} />
          <Flex gap={8}>
            <LinkButton variant="bezeledGray" onClick={() => router.push('/dashboard')}>
              {t('CANCEL')}
            </LinkButton>

            <Button
              color="secondary"
              disabled={!commissionAccepted}
              // onClick={onClick}
              // disabled={!type || isLoading || expired || (type !== TransferTypes.LNURLW && insufficientBalance)}
              // loading={isLoading}
            >
              {'Confirmar'}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  );
}
