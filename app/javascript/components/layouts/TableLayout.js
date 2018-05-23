import React from 'react'

import PageHeaderLayout  from './PageHeaderLayout'
import TabCard from '../organisms/TabCard'
import TabsSection from '../organisms/TabsSection'

const TableLayout = ({ children, pageHeader, tabSection }) => {
  return (
    <React.Fragment>
      <PageHeaderLayout {...pageHeader} />
      { tabSection ?
        (
          <React.Fragment>
            <TabsSection {...tabSection} />
            <TabCard>{children}</TabCard>
          </React.Fragment>
        )
        :
        children
      }
    </React.Fragment>
  )
}

export default TableLayout
