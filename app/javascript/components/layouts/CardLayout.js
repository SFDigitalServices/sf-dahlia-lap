import React, { useEffect } from 'react'

import PageHeader from '../organisms/PageHeader'
import TabsSection from '../organisms/TabsSection'
import TabCard from '../organisms/TabCard'
import AppCard from '../molecules/AppCard'

const CardLayout = ({ children, pageHeader, tabSection, toolbar }) => {
  useEffect(() => {
    document.body.classList.add('bg-snow')
  }, [])

  if (tabSection && !tabSection.currentUrl) { tabSection.currentUrl = window.location.pathname }
  return (
    <React.Fragment>
      <PageHeader {...pageHeader} background='snow' />
      { tabSection
        ? (
          <TabsSection {...tabSection} background='snow'>
            <AppCard>{children}</AppCard>
          </TabsSection>
        )
        : (
          <React.Fragment>
            { toolbar && toolbar() }
            <TabCard padding>
              <AppCard>{children}</AppCard>
            </TabCard>
          </React.Fragment>
        )
      }
    </React.Fragment>
  )
}

export default CardLayout
