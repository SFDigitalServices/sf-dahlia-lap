import React from 'react'

import PageHeader from '../organisms/PageHeader'
import PageHeaderSimple from '../organisms/PageHeaderSimple'

const PageHeaderLayout = ({background, ...props}) => {
  if (props.content || props.action || props.breadcrumbs) {
    return <PageHeader {...props} background={background} />
  } else {
    return <PageHeaderSimple {...props} background={background} />
  }
}

export default PageHeaderLayout
