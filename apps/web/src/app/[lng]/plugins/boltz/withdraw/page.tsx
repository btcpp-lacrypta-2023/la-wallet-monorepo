'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import Navbar from '@/components/Layout/Navbar';
import { Button, Container, Divider, Feedback, Flex, Input, InputGroup, InputGroupRight } from '@lawallet/ui';

import { useTranslation } from '@/context/TranslateContext';
import { useActionOnKeypress } from '@/hooks/useActionOnKeypress';
import useErrors from '@/hooks/useErrors';
import { detectTransferType, formatLNURLData } from '@lawallet/react';
import { TransferTypes } from '@lawallet/react/types';
import { useState } from 'react';

export default function Page() {
  const { t } = useTranslation();

  const params = useSearchParams();

  const [inputText, setInputText] = useState<string>(params.get('data') ?? '');
  const [loading, setLoading] = useState<boolean>(false);

  const errors = useErrors();
  const router = useRouter();
  0;

  const initializeTransfer = async (data: string) => {
    if (loading) return;
    setLoading(true);

    const cleanData: string = data.trim();
    const type: TransferTypes = detectTransferType(cleanData);

    switch (type) {
      case TransferTypes.NONE:
        errors.modifyError('INVALID_RECIPIENT');
        setLoading(false);
        return;

      case TransferTypes.INVOICE:
        router.push(`/transfer/invoice/${cleanData}`);
        return;
    }

    const formattedLNURLData = await formatLNURLData(cleanData);
    if (formattedLNURLData.type === TransferTypes.NONE || formattedLNURLData.type === TransferTypes.INVOICE) {
      errors.modifyError('INVALID_RECIPIENT');
      setLoading(false);
      return;
    }

    router.push(`/transfer/lnurl?data=${cleanData}`);
    return;
  };

  const handleContinue = async () => {
    if (!inputText.length) return errors.modifyError('EMPTY_RECIPIENT');
    initializeTransfer(inputText);
  };

  useActionOnKeypress('Enter', handleContinue, [inputText]);

  const handlePasteInput = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <>
      <Navbar showBackPage={true} title={t('EXTRACT') + ' BTC'} overrideBack="/dashboard" />

      <Container size="small">
        <Divider y={16} />
        <Flex flex={1} direction="column">
          <InputGroup>
            <Input
              onChange={(e) => {
                errors.resetError();
                setInputText(e.target.value);
              }}
              placeholder={'Bitcoin mainnet address'}
              type="text"
              value={inputText}
              status={errors.errorInfo.visible ? 'error' : undefined}
              disabled={loading}
            />
            <InputGroupRight>
              <Button size="small" variant="borderless" onClick={handlePasteInput} disabled={!!inputText}>
                {t('PASTE')}
              </Button>
            </InputGroupRight>
          </InputGroup>

          <Feedback show={errors.errorInfo.visible} status={'error'}>
            {errors.errorInfo.text}
          </Feedback>

          <Divider y={16} />
        </Flex>
      </Container>

      <Flex>
        <Container size="small">
          <Divider y={16} />
          <Flex gap={8}>
            <Button variant="bezeledGray" onClick={() => router.push('/dashboard')}>
              {t('CANCEL')}
            </Button>

            <Button onClick={handleContinue} disabled={loading || inputText.length === 0} loading={loading}>
              {t('CONTINUE')}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  );
}
