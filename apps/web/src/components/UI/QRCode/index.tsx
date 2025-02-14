'use client';

import { useState } from 'react';
import ReactQRCode from 'react-qr-code';

import { copy } from '@/utils/share';

import { Text } from '@lawallet/ui';

import { appTheme } from '@/config';
import { useNotifications } from '@/context/NotificationsContext';
import { useTranslation } from '@/context/TranslateContext';
import { QRCode, Toast } from './style';

interface ComponentProps {
  value: string;
  size?: number;
  borderSize?: number;
  showCopy?: boolean;
  textToCopy?: string;
}

export default function Component({ value, size = 150, borderSize = 40, showCopy = true, textToCopy }: ComponentProps) {
  const [showToast, setShowToast] = useState(true);
  const { t } = useTranslation();
  const notifications = useNotifications();

  const handleCopy = (text: string) => {
    copy(text).then((res) => {
      setShowToast(false);
      notifications.showAlert({
        description: res ? t('SUCCESS_COPY') : t('ERROR_COPY'),
        type: res ? 'success' : 'error',
      });
    });
  };

  return (
    <>
      <QRCode
        size={size + borderSize}
        onClick={() => {
          handleCopy(textToCopy ? textToCopy : value);
        }}
      >
        {showCopy ? (
          <Toast $isShow={showToast}>
            <Text size="small">{t('PRESS_TO_COPY')}</Text>
            <span></span>
          </Toast>
        ) : null}

        <ReactQRCode value={value} size={size} fgColor={appTheme.colors.black} bgColor={appTheme.colors.white} />
      </QRCode>
    </>
  );
}
