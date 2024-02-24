'use client';

import Subnavbar from '@/components/Layout/Subnavbar';
import { ArrowRightIcon, Button, Card, Container, Divider, Flex, Heading, Icon, Text } from '@lawallet/ui';
import { useRouter } from 'next/navigation';

export default function Page() {
  // const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Container size="small">
        <Divider y={24} />
        <Heading>Plugins</Heading>
        <Divider y={24} />
        <Card>
          <Flex gap={16} justify="space-between" align="center">
            <div>
              <Text isBold>Boltz exchange (BETA)</Text>
              <Text>Submarine swap between Bitcoin Mainnet and lightning Network</Text>
            </div>
            <div>
              <Button onClick={() => router.push('/plugins/boltz')} variant="borderless">
                <Icon>
                  <ArrowRightIcon />
                </Icon>
              </Button>
            </div>
          </Flex>
        </Card>
        <Divider y={8} />
        <Divider y={24} />
      </Container>

      <Subnavbar path="plugins" />
    </>
  );
}
