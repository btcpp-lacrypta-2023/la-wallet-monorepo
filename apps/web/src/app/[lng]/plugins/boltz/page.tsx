'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Navbar from '@/components/Layout/Navbar';
import { Container, Divider, Flex, Text, Button, ReceiveIcon, SendIcon, Icon, Sheet } from '@lawallet/ui';

export default function Page() {
  const router = useRouter();

  const [showSheet, setShowSheet] = useState(false);

  return (
    <>
      <Navbar title={'Boltz'} showBackPage={true} />

      <Container size="small">
        <Divider y={16} />
        <Flex gap={8}>
          <Button onClick={() => setShowSheet(true)}>
            <Icon>
              <ReceiveIcon />
            </Icon>
            Depositar
          </Button>
          <Button color="secondary" onClick={() => router.push('/plugins/boltz/withdraw')}>
            <Icon>
              <SendIcon />
            </Icon>
            Extraer
          </Button>
        </Flex>
        <Divider y={16} />
      </Container>

      <Sheet title="Depositar" isOpen={showSheet} onClose={() => setShowSheet(false)}>
        <Container>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti vel sapiente recusandae eveniet quaerat ea
            pariatur, officia, possimus distinctio repellat alias cumque ducimus harum, quasi exercitationem et iure
            laudantium facere.
          </Text>
        </Container>
      </Sheet>
    </>
  );
}
