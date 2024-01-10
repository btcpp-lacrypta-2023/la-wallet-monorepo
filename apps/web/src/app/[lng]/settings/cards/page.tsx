'use client'

import { useTranslation } from '@/context/TranslateContext'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import { MainLoader } from '@/components/Loader/Loader'
import { Divider, Flex } from '@/components/UI'
import AddNewCardModal from './components/AddCard'
import DebitCard from './components/DebitCard'
import EmptyCards from './components/EmptyCards'
import { useCardConfig } from '@lawallet/react'
import { Design } from '@lawallet/utils'

export default function Page() {
  const { cards, toggleCardStatus } = useCardConfig()
  const { t } = useTranslation()

  return (
    <>
      <Navbar
        title={t('MY_CARDS')}
        showBackPage={true}
        overrideBack={'/settings'}
      />

      <Container size="small">
        <Divider y={16} />
        {cards.loading ? (
          <MainLoader />
        ) : Object.keys(cards.data).length ? (
          <Flex direction="column" align="center" gap={16}>
            {Object.entries(cards.data).map(([key, value]) => {
              return (
                <DebitCard
                  card={{
                    uuid: key,
                    data: value as { design: Design },
                    config: cards.config.cards?.[key]
                  }}
                  toggleCardStatus={toggleCardStatus}
                  key={key}
                />
              )
            })}
          </Flex>
        ) : (
          <EmptyCards />
        )}
        <Divider y={16} />
      </Container>

      <AddNewCardModal />
    </>
  )
}
