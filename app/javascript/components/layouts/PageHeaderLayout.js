import React from 'react'

import PageHeader from '../organisms/PageHeader'
import PageHeaderSimple from '../organisms/PageHeaderSimple'

const PageHeaderLayout = (props) => {
  if (props.content || props.action || props.breadcrumbs) {
    return <PageHeader {...props} />
  } else {
    return <PageHeaderSimple {...props} />
  }
}

export default PageHeaderLayout
