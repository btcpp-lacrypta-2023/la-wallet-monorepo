import { TokenList } from '@/components/TokenList';
import { Confetti, Keyboard } from '@/components/UI';
import { appTheme } from '@/config';
import { useTranslation } from '@/context/TranslateContext';
import { useActionOnKeypress } from '@/hooks/useActionOnKeypress';
import useErrors from '@/hooks/useErrors';
import { useNumpad } from '@/hooks/useNumpad';
import { SatoshiV2Icon } from '@bitcoin-design/bitcoin-icons-react/filled';
import { formatToPreference, useWalletContext, useZap } from '@lawallet/react';
import { Button, CheckIcon, Container, Divider, Feedback, Flex, Heading, Icon, Sheet, Text } from '@lawallet/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSignMessage } from 'wagmi';

type SheetTypes = 'amount' | 'qr' | 'finished';
type InvoiceSheetTypes = {
  isOpen: boolean;
  handleCopy: (text: string) => void;
  onClose: () => void;
};

const DepositBoltzSheet = ({ isOpen, onClose }: InvoiceSheetTypes) => {
  const errors = useErrors();
  const [sheetStep, setSheetStep] = useState<SheetTypes>('amount');

  const { lng, t } = useTranslation();

  const {
    account: { identity },
    settings: {
      props: { currency },
    },
  } = useWalletContext();

  const { invoice, resetInvoice } = useZap({ receiverPubkey: identity.data.hexpub });

  const { isPending, isError, isSuccess, error, signMessage } = useSignMessage();
  const numpadData = useNumpad(currency);
  const router = useRouter();

  const handleClick = () => {
    // if (invoice.loading) return;

    // const amountSats: number = numpadData.intAmount['SAT'];
    // if (amountSats < 1 || amountSats > MAX_INVOICE_AMOUNT) {
    //   const convertedMinAmount: number = convertCurrency(1, 'SAT', currency);
    //   const convertedMaxAmount: number = convertCurrency(MAX_INVOICE_AMOUNT, 'SAT', currency);

    //   errors.modifyError('ERROR_INVOICE_AMOUNT', {
    //     minAmount: convertedMinAmount.toString(),
    //     maxAmount: formatToPreference(currency, convertedMaxAmount, lng),
    //     currency: currency,
    //   });
    //   return;
    // }

    // createZapInvoice(amountSats).then((bolt11: string | undefined) => {
    //   if (!bolt11) {
    //     errors.modifyError('ERROR_ON_CREATE_INVOICE');
    //     return;
    //   }

    // });

    setSheetStep('qr');
  };

  const handleCloseSheet = () => {
    if (sheetStep === 'finished' || !identity.data.username.length) {
      router.push('/dashboard');
    } else {
      numpadData.resetAmount();
      setSheetStep('amount');
      resetInvoice();
      onClose();
    }
  };

  const handleSignature = async () => {
    if (isPending) return;

    signMessage({
      message: `Sign transaction of ${numpadData.intAmount['SAT'] / 10 ** 8} RBTC`,
    });
  };

  useEffect(() => {
    if (errors.errorInfo.visible) errors.resetError();
  }, [numpadData.intAmount]);

  useEffect(() => {
    if (invoice.payed || isSuccess) setSheetStep('finished');
  }, [invoice.payed, isSuccess]);

  useActionOnKeypress('Enter', handleClick, [numpadData.intAmount['SAT']]);

  return (
    <Sheet
      title={
        sheetStep === 'amount' ? t('DEFINE_AMOUNT') : sheetStep === 'qr' ? t('WAITING_PAYMENT') : t('PAYMENT_RECEIVED')
      }
      isOpen={isOpen || !identity.data.username.length}
      closeText={t('CLOSE')}
      onClose={handleCloseSheet}
    >
      {sheetStep === 'amount' && (
        <>
          <Container size="small">
            <Flex direction="column" gap={8} flex={1} justify="center" align="center">
              <Flex justify="center" align="center" gap={4}>
                {currency === 'SAT' ? (
                  <Icon size="small">
                    <SatoshiV2Icon />
                  </Icon>
                ) : (
                  <Text>$</Text>
                )}
                <Heading>{formatToPreference(currency, numpadData.intAmount[numpadData.usedCurrency], lng)}</Heading>
              </Flex>

              <TokenList />

              <Feedback show={errors.errorInfo.visible} status={'error'}>
                {errors.errorInfo.text}
              </Feedback>
            </Flex>
            <Divider y={24} />
            <Flex gap={8}>
              <Button
                variant="filled"
                onClick={handleClick}
                disabled={invoice.loading || numpadData.intAmount['SAT'] === 0}
                loading={invoice.loading}
              >
                {t('GENERATE')}
              </Button>
            </Flex>
            <Divider y={24} />
            <Keyboard numpadData={numpadData} />
          </Container>
        </>
      )}
      {sheetStep === 'qr' && (
        <Container size="small">
          <Flex flex={1} direction="column" align="center" justify="center">
            <Text>{t('SHOULD_TRANSFER')}</Text>
            <Divider y={12} />

            <Flex align="center" justify="center" gap={4}>
              <Icon size="small">
                <SatoshiV2Icon />
              </Icon>
              <Heading>{numpadData.intAmount['SAT'] / 10 ** 8}</Heading>
              <Text>RBTC</Text>
            </Flex>

            <Divider y={12} />
            <Flex>
              <Button onClick={handleSignature} loading={isPending} disabled={isPending}>
                {t('TRANSFER')}
              </Button>
            </Flex>

            {isError && <Text color="error">{error?.message}</Text>}
          </Flex>
        </Container>
      )}
      {sheetStep === 'finished' && (
        <>
          <Confetti />
          <Container size="small">
            <Flex direction="column" justify="center" flex={1} align="center" gap={8}>
              <Icon color={appTheme.colors.primary}>
                <CheckIcon />
              </Icon>
              <Text size="small" color={appTheme.colors.gray50}>
                {t('PAYMENT_RECEIVED')}
              </Text>
              <Flex justify="center" align="center" gap={4}>
                {currency === 'SAT' ? (
                  <Icon size="small">
                    <SatoshiV2Icon />
                  </Icon>
                ) : (
                  <Text>$</Text>
                )}
                <Heading>{formatToPreference(currency, numpadData.intAmount[numpadData.usedCurrency], lng)}</Heading>
              </Flex>
            </Flex>
            <Flex gap={8}>
              <Button variant="bezeledGray" onClick={handleCloseSheet}>
                {t('CLOSE')}
              </Button>
            </Flex>
          </Container>
        </>
      )}
    </Sheet>
  );
};

export default DepositBoltzSheet;
