'use client'

import { useState } from 'react'
import ReactQRCode from 'react-qr-code'

import { copy } from '@/utils/share'

import Text from '../Text'

import { useTranslation } from '@/context/TranslateContext'
import theme from '@/styles/theme'
import { QRCode, Toast } from './style'
import useAlert from '@/hooks/useAlerts'
import { Alert } from '..'

interface ComponentProps {
  value: string
  size?: number
  borderSize?: number
  showCopy?: boolean
  textToCopy?: string
}

export default function Component({
  value,
  size = 150,
  borderSize = 40,
  showCopy = true,
  textToCopy
}: ComponentProps) {
  const [showToast, setShowToast] = useState(true)
  const { t } = useTranslation()
  const notifications = useAlert()

  const handleCopy = (text: string) => {
    copy(text).then(res => {
      setShowToast(false)
      notifications.showAlert({
        description: res ? t('SUCCESS_COPY') : t('ERROR_COPY'),
        type: res ? 'success' : 'error'
      })
    })
  }

  return (
    <>
      <Alert
        title={notifications.alert?.title}
        description={notifications.alert?.description}
        type={notifications.alert?.type}
        isOpen={!!notifications.alert}
      />

      <QRCode
        size={size + borderSize}
        onClick={() => {
          if (showCopy) handleCopy(textToCopy ? textToCopy : value)
        }}
      >
        {showCopy ? (
          <Toast $isShow={showToast}>
            <Text size="small">{t('PRESS_TO_COPY')}</Text>
            <span></span>
          </Toast>
        ) : null}

        <ReactQRCode
          value={value}
          size={size}
          fgColor={theme.colors.black}
          bgColor={theme.colors.white}
        />
      </QRCode>
    </>
  )
}
