import React from 'react'

import PageHeaderLayout  from './PageHeaderLayout'
import TabCard from '../organisms/TabCard'
import TabsSection from '../organisms/TabsSection'

const TableLayout = ({ children, pageHeader, tabCard, tabSection }) => {
  return (
    <React.Fragment>
      <PageHeaderLayout {...pageHeader} />
      { tabSection && <TabsSection {...tabSection} /> }
      { tabCard ?
          (<TabCard {...tabCard} >{children}</TabCard>)
          :
          children
      }
    </React.Fragment>
  )
}

export default TableLayout
