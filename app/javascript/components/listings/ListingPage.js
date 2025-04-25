import React from 'react'

import appPaths from 'utils/appPaths'

import ListingDetails from './ListingDetails'
import CardLayout from '../layouts/CardLayout'

const ListingPageDetails = ({ listing }) => {
  return <ListingDetails listing={listing} />
}

const ListingPage = ({ listing, user_is_admin }) => {
  const tabs = {
    items: [
      { title: 'Listing Details', url: appPaths.toListing(listing.id), active: true },
      { title: 'Applications', url: appPaths.toApplications(listing.id) }
    ]
  }

  if (user_is_admin) {
    tabs.items.push({ title: 'Lottery Results', url: appPaths.toLotteryResults(listing.id) })
  }

  return (
    <CardLayout pageHeader={{ title: listing.name }} tabSection={tabs}>
      <ListingPageDetails listing={listing} />
    </CardLayout>
  )
}

export default ListingPage
