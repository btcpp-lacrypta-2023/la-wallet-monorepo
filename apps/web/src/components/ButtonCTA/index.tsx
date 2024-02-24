import { ReactNode } from 'react';

import { Default } from './style';
import { Divider } from '@lawallet/ui';

interface ButtonCTAProps {
  children: ReactNode;
}

export default function ButtonCTA(props: ButtonCTAProps) {
  const { children } = props;

  return (
    <Default>
      <div>{children}</div>
    </Default>
  );
}
