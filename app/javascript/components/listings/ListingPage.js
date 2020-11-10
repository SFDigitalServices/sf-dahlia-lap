import React from 'react'

import appPaths from 'utils/appPaths'

import CardLayout from '../layouts/CardLayout'
import ListingDetails from './ListingDetails'

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
