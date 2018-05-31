import React from 'react'

import PaperApplicationForm from './application_form/PaperApplicationForm'
import CardLayout from '../layouts/CardLayout'

const ApplicationEditPageForm = ({ listing, application, editPage }) => {
  return (
    <PaperApplicationForm
      listing={listing}
      application={application}
      editPage={editPage} />
  )
}

const ApplicationEditPage = (props) => {
  const { application, listing } = props
  const pageHeader = {
    title: 'Edit Application',
    content: `Application lottery number: ${application.Lottery_Number}. For listing: ${listing.Name}`
  }

  return (
    <CardLayout pageHeader={pageHeader}>
      <ApplicationEditPageForm {...props} />
    </CardLayout>
  )
}

export default ApplicationEditPage
