import React from 'react'

import PageHeader from '../organisms/PageHeader'
import TabsSection from '../organisms/TabsSection'
import TabCard from '../organisms/TabCard'
import AppCard from '../molecules/AppCard'

class CardLayout extends React.Component {

  componentWillMount = () => {
    document.body.classList.add('bg-snow')
  }

  render() {
    const { children, pageHeader, tabSection } = this.props

    if (!tabSection.currentUrl)
      tabSection.currentUrl = window.location.pathname

    return (
      <React.Fragment>
        <PageHeader {...pageHeader} background='snow'/>
        { tabSection ?
          (
            <TabsSection {...tabSection} background='snow'>
              <AppCard>{children}</AppCard>
            </TabsSection>
          )
          :
          (
            <TabCard padding={true}>
              <AppCard>{children}</AppCard>
            </TabCard>
          )
        }
      </React.Fragment>
    )
  }
}

export default CardLayout
