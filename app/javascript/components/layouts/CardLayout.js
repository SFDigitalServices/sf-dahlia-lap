import React, { useEffect } from 'react'

import PageHeader from '../organisms/PageHeader'
import TabsSection from '../organisms/TabsSection'
import TabCard from '../organisms/TabCard'
import AppCard from '../molecules/AppCard'

const CardLayout = ({ children, pageHeader, tabSection, toolbar }) => {
  // With the empty array passed as the second argument
  // this useEffect call acts like a componentDidMount call
  useEffect(() => {
    document.body.classList.add('bg-snow')
  }, [])

  // This gives us the url path with associated params
  const currentUrl = window.location.href.split(window.location.host)[1]
  if (tabSection && !tabSection.currentUrl) { tabSection.currentUrl = currentUrl }
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
