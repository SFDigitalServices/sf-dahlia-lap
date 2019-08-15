import React, { useEffect } from 'react'

import PageHeader from '../organisms/PageHeader'
import TabsSection from '../organisms/TabsSection'
import TabCard from '../organisms/TabCard'

const TableLayout = ({ children, pageHeader, tabSection }) => {
  // With the empty array passed as the second argument
  // this useEffect call acts like a componentDidMount call
  useEffect(() => {
    document.body.classList.add('bg-white')
  }, [])

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}

export default TableLayout
