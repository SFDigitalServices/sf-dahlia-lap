import React from 'react'

import PaperApplicationForm from './application_form/PaperApplicationForm'
import CardLayout from '../layouts/CardLayout'
import mapProps from '~/utils/mapProps'
import { mapListing, mapApplication } from '~/components/mappers/soqlToDomain'
import { saveApplication } from './actions'

const ApplicationEditPageForm = ({ listing, application, editPage, lendingInstitutions }) => {
  const saveEditApplication = async (submitType, submittedValues, application, listing, editPage) => {
    return saveApplication(submitType, submittedValues, application, listing, editPage)
  }
  return (
    <PaperApplicationForm
      listing={listing}
      application={application}
      editPage={editPage}
      onSubmit={saveEditApplication}
      lendingInstitutions={lendingInstitutions} />
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
        lendingInstitutions={lendingInstitutions} />
    </CardLayout>
  )
}

const mapProperties = ({ listing, application, editPage, lendingInstitutions }) => {
  return {
    listing: mapListing(listing),
    application: mapApplication(application),
    lendingInstitutions: lendingInstitutions,
    editPage
  }
}

export default mapProps(mapProperties)(ApplicationEditPage)
