import React from 'react'

import PageHeader from '../organisms/PageHeader'
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
        <PageHeader {...pageHeader} background='dust'/>
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
