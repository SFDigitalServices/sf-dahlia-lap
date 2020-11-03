import React from 'react'

import ListingDetails from './ListingDetails'
import CardLayout from '../layouts/CardLayout'
import appPaths from 'utils/appPaths'

const ListingPageDetails = ({ listing }) => {
  return <ListingDetails listing={listing} />
}

const ListingPage = ({ listing }) => {
  const tabs = {
    items: [
      { title: 'Listing Details', url: appPaths.toListing(listing.id), active: true },
      { title: 'Applications', url: appPaths.toApplications(listing.id) }
    ]
  }

  return (
    <CardLayout pageHeader={{ title: listing.name }} tabSection={tabs}>
      <ListingPageDetails listing={listing} />
    </CardLayout>
  )
}

export default ListingPage
