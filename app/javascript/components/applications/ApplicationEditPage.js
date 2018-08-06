import React from 'react'

import PaperApplicationForm from './application_form/PaperApplicationForm'
import CardLayout from '../layouts/CardLayout'
import mapProps from '~/utils/mapProps'
import { mapListing, mapApplication } from '~/components/mappers/soqlToDomain'

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
    content: `Application lottery number: ${application.lottery_number}. For listing: ${listing.name}`
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
  return {
    listing: mapListing(listing),
    application: mapApplication(application),
    editPage
  }
}

export default mapProps(mapProperties)(ApplicationEditPage)
