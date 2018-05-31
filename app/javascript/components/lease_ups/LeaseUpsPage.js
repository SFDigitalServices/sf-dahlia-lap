import React from 'react'

import LeaseUpsTableContainer from './LeaseUpsTableContainer'
import TableLayout from '../layouts/TableLayout'

const LeaseUpsPage = ({ listing, results }) => {
  const pageHeader = {
    title: listing.Name,
    content: listing.Building_Street_Address,
    action: {
      title: 'Export',
      link: `/listings/${listing.Id}/lease_ups/export`
    },
    breadcrumbs:[
      {title: 'Lease Ups',  link: '/lease_ups'},
      {title: listing.Name, link: `/listings/${listing.Id}/lease_ups`}
    ]
  }

  return (
    <TableLayout pageHeader={pageHeader}>
      <LeaseUpsTableContainer listing={listing} results={results} />
    </TableLayout>
  )
}

export default LeaseUpsPage
