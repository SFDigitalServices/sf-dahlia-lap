import React from 'react'

import ListingDetails from './ListingDetails'
import CardLayout from '../layouts/CardLayout'
import mapProps from '~/utils/mapProps'
import { mapListing } from '~/components/mappers/soqlToDomain'

const ListingPageDetails = ({ listing }) => {
  return <ListingDetails listing={listing} />
}

const ListingPage = ({ listing }) => {
  const tabs = {
    items: [
      { title: 'Listing Details', url: `/listings/${listing.id}` },
      { title: 'Applications',    url: `/listings/${listing.id}/applications`  }
    ],
    currentUrl:window.location.pathname
  }

  return (
    <CardLayout pageHeader={{title: listing.name}} tabSection={tabs}>
      <ListingPageDetails listing={listing} />
    </CardLayout>
  )
}

const mapProperties = ({ listing }) => {
  return {
    listing: mapListing(listing)
  }
}

export default mapProps(mapProperties)(ListingPage)
