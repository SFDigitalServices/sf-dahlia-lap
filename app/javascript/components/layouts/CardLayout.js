import React from 'react'

import PageHeaderLayout  from './PageHeaderLayout'
import TabsSection from '../organisms/TabsSection'

const CardLayout = ({ children, pageHeader, tabCard, tabSection }) => {
  return (
    <React.Fragment>
      <PageHeaderLayout {...pageHeader} />
      { tabSection ?
        (<TabsSection {...tabSection} >{children}</TabsSection>)
        :
        children
      }
    </React.Fragment>
  )
}

export default CardLayout
