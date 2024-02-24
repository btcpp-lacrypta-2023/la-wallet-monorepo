'use client';

import { Container, Divider, Flex, Heading, Text, Card, ArrowRightIcon, Icon, Button } from '@lawallet/ui';
import Subnavbar from '@/components/Layout/Subnavbar';
import { useRouter } from 'next/navigation';

export default function Page() {
  // const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Container size="small">
        <Divider y={24} />
        <Heading>Plugins</Heading>
        <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, voluptates.</Text>

        <Divider y={24} />
        <Card>
          <Flex gap={16} justify="space-between" align="center">
            <div>
              <Text isBold>Boltz exchange</Text>
              <Text>Lorem ipsum dolor sit amet consectetur.</Text>
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
