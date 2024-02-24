'use client';

import { useRouter } from 'next/navigation';
import { HomeIcon, RocketIcon } from '@bitcoin-design/bitcoin-icons-react/filled';

import { Container, Button, QrCodeIcon, Icon } from '@lawallet/ui';

import { SubnavbarPrimitive } from './style';
import { ReactNode } from 'react';
import { useTranslation } from '@/context/TranslateContext';

import ButtonCTA from '@/components/ButtonCTA';

interface ComponentProps {
  children?: ReactNode;
  title?: string;
  showBackPage?: boolean;
  overrideBack?: string;
  path: string;
}

export default function Subnavbar(props: ComponentProps) {
  const { children, showBackPage = false, title, overrideBack = '', path = 'home' } = props;

  const router = useRouter();
  const { t } = useTranslation();

  const onlyChildren = !children;

  return (
    <SubnavbarPrimitive>
      <Container>
        <div className="info">
          <button onClick={() => router.push('/')} className={`${path === 'home' && 'active'}`}>
            <Icon>
              <HomeIcon />
            </Icon>
            Home
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
