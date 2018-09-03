import React from 'react'

import PaperApplicationForm from './application_form/PaperApplicationForm'
import CardLayout from '../layouts/CardLayout'
import mapProps from '~/utils/mapProps'
import { mapListing } from '~/components/mappers/soqlToDomain/listing'
import { saveApplication } from './actions'

const ApplicationNewForm = ({ listing }) => {
  const saveNewApplication = async (submitType, submittedValues, application, listing, editPage) => {
    submittedValues.listing = { id: listing.id }
    return saveApplication(submitType, submittedValues, application, listing, editPage)
  }

  return (
    <PaperApplicationForm
      listing={listing}
      onSubmit={saveNewApplication}
    />
  )
}

const ApplicationNewPage = ({ listing }) => {
  const pageHeader = {
    title: `New Application: ${listing.name}`
  }
  return (
    <CardLayout pageHeader={pageHeader}>
      <ApplicationNewForm listing={listing} />
    </CardLayout>
  )
}

const mapProperties = ({ listing }) => {
  return {
    listing: mapListing(listing)
  }
}

export default mapProps(mapProperties)(ApplicationNewPage)
