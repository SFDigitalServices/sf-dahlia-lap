import React from 'react'

import PageHeaderLayout  from './PageHeaderLayout'
import TabsSection from '../organisms/TabsSection'
import TabCard from '../organisms/TabCard'

class TableLayout extends React.Component {
  componentWillMount = () => {
    let orig = document.body.className
    document.body.className = orig + (orig ? ' ' : '') + 'bg-white'
  }

  render() {
    const { children, pageHeader, tabSection } = this.props
    return (
      <React.Fragment>
        <PageHeaderLayout {...pageHeader} background='dust'/>
        { tabSection ?
          (
            <TabsSection {...tabSection} background='dust' padding={true}>
              {children}
            </TabsSection>
          )
          :
          (
            <TabCard padding={true}>
              {children}
            </TabCard>
          )
        }
      </React.Fragment>
    )
  }
}

export default TableLayout
