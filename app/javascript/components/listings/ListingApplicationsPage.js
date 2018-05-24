import React from 'react'

import IndexTable from '../IndexTable'
import CardLayout from '../layouts/CardLayout'

const ListingApplicationsTable = ({ listing, results, fields }) => {
  return (
    <IndexTable
      results={results}
      fields= {fields}
      links={['View Application'] } />
  )
}

const ListingApplicationsPage = (props) => {
  const { listing } = props

  const pageHeader = {
    title: listing.Name
  }

  const tabs = {
    items: [
      { title: 'Listing Details', url: `/listings/${listing.Id}` },
      { title: 'Applications',    url: `/listings/${listing.Id}/applications`  }
    ],
    currentUrl:window.location.pathname
  }

  return (
    <CardLayout pageHeader={pageHeader} tabSection={tabs}>
      <ListingApplicationsTable {...props} />
    </CardLayout>
  )
}

export default ListingApplicationsPage
