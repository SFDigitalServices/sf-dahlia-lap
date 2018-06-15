import React from 'react'

import LeaseUpsTableContainer from './LeaseUpsTableContainer'
import TableLayout from '../layouts/TableLayout'
import mapProps from '~/utils/mapProps'
import mapProperties from './mapProperties'

const LeaseUpsPage = ({ listing, applications }) => {
  const pageHeader = {
    title: listing.name,
    content: listing.building_street_address,
    action: {
      title: 'Export',
      link: `/listings/${listing.id}/lease_ups/export`
    },
    breadcrumbs:[
      {title: 'Lease Ups',  link: '/lease_ups'},
      {title: listing.name, link: `/listings/${listing.id}/lease_ups`}
    ]
  }

  return (
    <TableLayout pageHeader={pageHeader}>
      <LeaseUpsTableContainer listing={listing} applications={applications} />
    </TableLayout>
  )
}

export default mapProps(mapProperties)(LeaseUpsPage)
