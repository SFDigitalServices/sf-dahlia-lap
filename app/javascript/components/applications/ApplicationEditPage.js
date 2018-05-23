import React from 'react'

import PageHeader from '../organisms/PageHeader'
import PaperApplicationForm from './application_form/PaperApplicationForm'

const ApplicationEditPageHeader = ({ listing, application }) => {
  return (
    <div>
      <PageHeader
        title='Edit Application'
        content={`Application lottery number: ${application.Lottery_Number}. For listing: ${listing.Name}`} />
    </div>
  )
}

const ApplicationEditPageForm = ({ listing, application, editPage }) => {
  return (
    <PaperApplicationForm
      listing={listing}
      application={application}
      editPage={editPage} />
  )
}

const ApplicationEditPage = (props) => {
  return (
    <div>
      <ApplicationEditPageHeader {...props}/>
      <ApplicationEditPageForm {...props} />
    </div>
  )
}

export default ApplicationEditPage
