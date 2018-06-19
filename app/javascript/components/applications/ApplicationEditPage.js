import React from 'react'

import PaperApplicationForm from './application_form/PaperApplicationForm'
import CardLayout from '../layouts/CardLayout'

import mapProps from '~/utils/mapProps'

const ApplicationEditPageForm = ({ listing, application, editPage }) => {
  return (
    <PaperApplicationForm
      listing={listing}
      application={application}
      editPage={editPage} />
  )
}

const ApplicationEditPage = ({ listing, application, editPage }) => {
  const pageHeader = {
    title: 'Edit Application',
    content: `Application lottery number: ${application.Lottery_Number}. For listing: ${listing.Name}`
  }

  return (
    <CardLayout pageHeader={pageHeader}>
      <ApplicationEditPageForm
        listing={listing}
        application={application}
        editPage={editPage} />
    </CardLayout>
  )
}

const mapProperties = ({ listing, application, editPage }) => {
  console.log(JSON.stringify(application))
  return {
    listing: listing,         // TODO: map here
    application: application, // TODO: map here
    editPage
  }
}

export default mapProps(mapProperties)(ApplicationEditPage)
