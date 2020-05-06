import React from 'react'

import ListingDetails from './ListingDetails'
import CardLayout from '../layouts/CardLayout'

const ListingPageDetails = ({ listing }) => {
  return <ListingDetails listing={listing} />
}

const ListingPage = ({ listing }) => {
  const tabs = {
    items: [
      { title: 'Listing Details', url: `/listings/${listing.id}`, active: true },
      { title: 'Applications', url: `/listings/${listing.id}/applications` }
    ]
  }

  return (
    <CardLayout pageHeader={{title: listing.name}} tabSection={tabs}>
      <ListingPageDetails listing={listing} />
    </CardLayout>
  )
}

export default ListingPage
