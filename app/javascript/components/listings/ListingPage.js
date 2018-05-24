import React from 'react'

// import PageHeaderSimple from '../organisms/PageHeaderSimple'
import ListingDetails from './ListingDetails'
import CardLayout from '../layouts/CardLayout'

// const ListingPageHeader = ({ listing }) => {
//   return (
//     <div>
//       <PageHeaderSimple title={listing.Name} />
//     </div>
//   )
// }

const ListingPageDetails = ({ listing }) => {
  return <ListingDetails listing={listing} />
}

const ListingPage = ({ listing }) => {
  const tabs = {
    items: [
      { title: 'Listing Details', url: `/listings/${listing.Id}` },
      { title: 'Applications',    url: `/listings/${listing.Id}/applications`  }
    ],
    currentUrl:window.location.pathname
  }

  return (
    <CardLayout pageHeader={{title: listing.Name}} tabSection={tabs}>
      <ListingPageDetails listing={listing} />
    </CardLayout>
  )
}

export default ListingPage
