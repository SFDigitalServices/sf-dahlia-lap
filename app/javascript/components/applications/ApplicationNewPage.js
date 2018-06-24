import React from 'react'

import PaperApplicationForm from './application_form/PaperApplicationForm'
import CardLayout from '../layouts/CardLayout'
import mapProps from '~/utils/mapProps'
import { mapListingDetails } from '~/components/mappers/soqlToDomain/listing'

const ApplicationNewForm = ({ listing }) => {
  return (
    <PaperApplicationForm listing={listing} />
  )
}

const ApplicationNewPage = ({ listing }) => {
  const pageHeader = {
    title: `New Application: ${listing.Name}`
  }
  return (
    <CardLayout pageHeader={pageHeader}>
      <ApplicationNewForm listing={listing} />
    </CardLayout>
  )
}

const mapProperties = ({ listing }) => {
  return {
    listing
  }
  // return {
  //   listing: mapListingDetails(listing) // TODO: map here
  // }
}

export default mapProps(mapProperties)(ApplicationNewPage)
