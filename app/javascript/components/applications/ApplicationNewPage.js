import React from 'react'

import PaperApplicationForm from './application_form/PaperApplicationForm'
import CardLayout from '../layouts/CardLayout'
import mapProps from '~/utils/mapProps'
import { mapListing } from '~/components/mappers/soqlToDomain/listing'
import { saveApplication } from './actions'

const ApplicationNewForm = ({ listing, lendingInstitutions }) => {
  const saveNewApplication = async (submitType, submittedValues, application, listing, editPage) => {
    submittedValues.listing = { id: listing.id }
    return saveApplication(submitType, submittedValues, application, listing, editPage)
  }

  return (
    <PaperApplicationForm
      listing={listing}
      lendingInstitutions={lendingInstitutions}
      onSubmit={saveNewApplication}
    />
  )
}

const ApplicationNewPage = ({ listing, lendingInstitutions }) => {
  const pageHeader = {
    title: `New Application: ${listing.name}`
  }
  return (
    <CardLayout pageHeader={pageHeader}>
      <ApplicationNewForm listing={listing} lendingInstitutions={lendingInstitutions} />
    </CardLayout>
  )
}

const mapProperties = ({ listing, lendingInstitutions }) => {
  return {
    listing: mapListing(listing),
    lendingInstitutions: lendingInstitutions
  }
}

export default mapProps(mapProperties)(ApplicationNewPage)
