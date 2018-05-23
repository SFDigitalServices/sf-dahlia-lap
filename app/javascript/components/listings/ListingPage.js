import React from 'react'

import PageHeaderSimple from '../organisms/PageHeaderSimple'
import ListingDetails from './ListingDetails'

const ListingPageHeader = ({ listing }) => {
  return (
    <div>
      <PageHeaderSimple title={listing.Name} />
    </div>
  )
}

const ListingPageDetails = ({ listing }) => {
  return (
    <div>
      <ListingDetails listing={listing} />
    </div>
  )
}

const ListingPage = ({ listing }) => {
  return (
    <div>
      <ListingPageHeader listing={listing} />
      <ListingPageDetails listing={listing} />
    </div>
  )
}

export default ListingPage
