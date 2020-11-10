import React from 'react'

import { useEffectOnMount } from 'utils/customHooks'

import AppCard from '../molecules/AppCard'
import PageHeader from '../organisms/PageHeader'
import TabCard from '../organisms/TabCard'
import TabsSection from '../organisms/TabsSection'

const CardLayout = ({ children, pageHeader, tabSection, toolbar }) => {
  useEffectOnMount(() => {
    document.body.classList.add('bg-snow')
  })

  return (
    <>
      <PageHeader {...pageHeader} background='snow' />
      {tabSection ? (
        <TabsSection {...tabSection} padding='false'>
          {children}
        </TabsSection>
      ) : (
        <>
          {toolbar && toolbar()}
          <TabCard padding>
            <AppCard>{children}</AppCard>
          </TabCard>
        </>
      )}
    </>
  )
}

export default CardLayout
