import React from 'react'

import PageHeader from '../organisms/PageHeader'
import TabsSection from '../organisms/TabsSection'
import TabCard from '../organisms/TabCard'
import AppCard from '../molecules/AppCard'

class CardLayout extends React.Component {
  componentWillMount = () => {
    document.body.classList.add('bg-snow')
  }

  render () {
    const { children, pageHeader, tabSection, toolbar } = this.props

    if (tabSection && !tabSection.currentUrl) { tabSection.currentUrl = window.location.pathname }

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
}

export default CardLayout
