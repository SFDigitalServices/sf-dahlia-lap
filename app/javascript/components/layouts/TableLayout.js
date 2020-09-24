import React from 'react'
import { useEffectOnMount } from '~/utils/customHooks'

import PageHeader from '../organisms/PageHeader'
import TabsSection from '../organisms/TabsSection'
import TabCard from '../organisms/TabCard'

const TableLayout = ({ children, pageHeader, tabSection }) => {
  useEffectOnMount(() => {
    document.body.classList.add('bg-white')
  })

  return (
    <>
      <PageHeader {...pageHeader} background='dust' />
      { tabSection
        ? (
          <TabsSection {...tabSection} background='dust' padding>
            {children}
          </TabsSection>
        )
        : (
          <TabCard padding>
            {children}
          </TabCard>
        )
      }
    </>
  )
}

export default TableLayout
