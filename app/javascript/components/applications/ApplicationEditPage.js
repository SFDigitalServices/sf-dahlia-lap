import React from 'react'

import mapProps from 'utils/mapProps'

import CardLayout from '../layouts/CardLayout'
import { saveApplication } from './actions'
import PaperApplicationForm from './application_form/PaperApplicationForm'

const ApplicationEditPageForm = ({ listing, application, editPage, lendingInstitutions }) => {
  const saveEditApplication = async (submitType, submittedValues, listing, editPage) => {
    submittedValues.listing_id = listing.id
    return saveApplication(submitType, submittedValues, listing, editPage)
  }
  return (
    <PaperApplicationForm
      listing={listing}
      application={application}
      editPage={editPage}
      onSubmit={saveEditApplication}
      lendingInstitutions={lendingInstitutions}
    />
  )
}

const ApplicationEditPage = ({ listing, application, editPage, lendingInstitutions }) => {
  const pageHeader = {
    title: 'Edit Application',
    content: `Application lottery number: ${application.lottery_number}. For listing: ${listing.name}`
  }

  return (
    <CardLayout pageHeader={pageHeader}>
      <ApplicationEditPageForm
        listing={listing}
        application={application}
        editPage={editPage}
        lendingInstitutions={lendingInstitutions}
      />
    </CardLayout>
  )
}

const mapProperties = ({ listing, application, editPage, lendingInstitutions }) => {
  return {
    listing,
    application: application,
    lendingInstitutions: lendingInstitutions,
    editPage
  }
}

export default mapProps(mapProperties)(ApplicationEditPage)
