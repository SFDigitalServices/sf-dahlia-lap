import React from 'react'

import InfoAlert from 'components/molecules/InfoAlert'
import { useEffectOnMount } from 'utils/customHooks'

import PageHeader from '../organisms/PageHeader'
import TabCard from '../organisms/TabCard'
import TabsSection from '../organisms/TabsSection'

const TableLayout = ({ children, pageHeader, tabSection, info }) => {
  useEffectOnMount(() => {
    document.body.classList.add('bg-white')
  })

  return (
    <>
      <PageHeader {...pageHeader} background='dust' />
      {info && info.show && <InfoAlert {...info} />}
      {tabSection ? (
        <TabsSection {...tabSection} background='dust' padding>
          {children}
        </TabsSection>
      ) : (
        <TabCard padding>{children}</TabCard>
      )}
    </>
  )
}

export default TableLayout
