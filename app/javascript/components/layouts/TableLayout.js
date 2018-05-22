import React from 'react'

import PageHeader from './organisims/PageHeader'
import TabCard from './organisms/TabCard'
import TabsSection from './organisms/TabsSection'

const TableLayout = ({ children, pageHeader, tabCard, tabSection }) => {
  return (
    <React.Fragment>
      <PageHeader {...pageHeader} />
      <TabsSection {...tabSection} />
      <TabCard {...tabCard} >
        {children}
      </TabCard>
    </React.Fragment>
  )
}

export default TableLayout
