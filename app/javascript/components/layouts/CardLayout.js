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

  return (
    <React.Fragment>
      <PageHeader {...pageHeader} background='snow' />
      { tabSection
        ? (
          <TabsSection {...tabSection} padding='false' tabBackground='white'>
            {children}
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
