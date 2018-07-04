import React from 'react'

import PaperApplicationForm from './application_form/PaperApplicationForm'
import CardLayout from '../layouts/CardLayout'
import mapProps from '~/utils/mapProps'
import { mapListing, mapApplication } from '~/components/mappers/soqlToDomain'
import { saveApplication } from './actions'

const ApplicationEditPageForm = ({ listing, application, editPage }) => {
  return (
    <PaperApplicationForm
      listing={listing}
      application={application}
      editPage={editPage}
      onSubmit={saveApplication} />
  )
}

const ApplicationEditPage = ({ listing, application, editPage }) => {
  console.log('domain', listing)
  console.log('domain', application)
  const pageHeader = {
    title: 'Edit Application',
    content: `Application lottery number: ${application.lottery_number}. For listing: ${listing.name}`
  }

  // return null
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
  console.log('soql', application)
  return {
    listing: mapListing(listing),
    application: mapApplication(application),
    editPage
  }
}

export default mapProps(mapProperties)(ApplicationEditPage)
