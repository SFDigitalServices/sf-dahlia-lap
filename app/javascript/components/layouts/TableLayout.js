import React from 'react'

import PageHeader from '../organisms/PageHeader'
import TabsSection from '../organisms/TabsSection'
import TabCard from '../organisms/TabCard'

class TableLayout extends React.Component {
  componentWillMount = () => {
    document.body.classList.add('bg-white')
  }

  render () {
    const { children, pageHeader, tabSection } = this.props
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
}

export default TableLayout
