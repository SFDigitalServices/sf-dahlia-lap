import React from 'react'

import PageHeaderLayout  from './PageHeaderLayout'
import TabsSection from '../organisms/TabsSection'

class CardLayout extends React.Component {

  componentWillMount = () => {
    let orig = document.body.className
    document.body.className = orig + (orig ? ' ' : '') + 'bg-snow'
  }

  render() {
    const { children, pageHeader, tabSection } = this.props

    return (
      <React.Fragment>
        <PageHeaderLayout {...pageHeader} background='snow'/>
        { tabSection ?
          (<TabsSection {...tabSection} background='snow'>{children}</TabsSection>)
          :
          children
        }
      </React.Fragment>
    )
  }
}

export default CardLayout
