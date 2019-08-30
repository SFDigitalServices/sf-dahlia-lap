import React from 'react'

import ListingDetails from './ListingDetails'
import CardLayout from '../layouts/CardLayout'

const ListingPageDetails = ({ listing }) => {
  return <ListingDetails listing={listing} />
}

const ListingPage = ({ listing }) => {
  console.log(listing)
  const tabs = {
    items: [
      { title: 'Listing Details', url: `/listings/${listing.id}` },
      { title: 'Applications', url: `/listings/${listing.id}/applications` }
    ],
    currentUrl: window.location.pathname
  }

  return (
    <CardLayout pageHeader={{title: listing.name}} tabSection={tabs}>
      <ListingPageDetails listing={listing} />
    </CardLayout>
  )
}

export default ListingPage
