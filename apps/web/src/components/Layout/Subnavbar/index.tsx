'use client';

import { HomeIcon, RocketIcon } from '@bitcoin-design/bitcoin-icons-react/filled';
import { useRouter } from 'next/navigation';

import { Button, Container, Icon, QrCodeIcon } from '@lawallet/ui';

import { useTranslation } from '@/context/TranslateContext';
import { ReactNode } from 'react';
import { SubnavbarPrimitive } from './style';

import ButtonCTA from '@/components/ButtonCTA';

interface ComponentProps {
  children?: ReactNode;
  title?: string;
  showBackPage?: boolean;
  overrideBack?: string;
  path: string;
}

export default function Subnavbar(props: ComponentProps) {
  const { path = 'home' } = props;

  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SubnavbarPrimitive>
      <Container>
        <div className="info">
          <button onClick={() => router.push('/dashboard')} className={`${path === 'home' && 'active'}`}>
            <Icon>
              <HomeIcon />
            </Icon>
            {t('HOME')}
          </button>
          <ButtonCTA>
            <Button color="secondary" onClick={() => router.push('/scan')}>
              <QrCodeIcon />
            </Button>
          </ButtonCTA>
          <button onClick={() => router.push('/plugins')} className={`${path === 'plugins' && 'active'}`}>
            <Icon>
              <RocketIcon />
            </Icon>
            Plugins
          </button>
        </div>
      </Container>
    </SubnavbarPrimitive>
  );
}
