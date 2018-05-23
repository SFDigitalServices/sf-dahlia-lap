import React from 'react'

import PageHeaderSimple from '../organisms/PageHeaderSimple'
import PaperApplicationForm from './application_form/PaperApplicationForm'

const ApplicationNewPageHeader = ({ listing }) => {
  return (
    <div>
      <PageHeaderSimple title={`New Application: ${listing.Name}`} />
    </div>
  )
}

const ApplicationNewPageForm = ({ listing }) => {
  return (
    <PaperApplicationForm listing={listing} />
  )
}

const ApplicationNewPage = (props) => {
  return (
    <div>
      <ApplicationNewPageHeader {...props}/>
      <ApplicationNewPageForm {...props} />
    </div>
  )
}

export default ApplicationNewPage
