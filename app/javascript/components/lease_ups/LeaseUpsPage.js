import React from 'react'
import { flow } from 'lodash'

import LeaseUpsTableContainer from './LeaseUpsTableContainer'
import TableLayout from '../layouts/TableLayout'
import mapProps from '~/utils/mapProps'
import { mapListingDetails, mapApplicationPreference } from '~/components/mappers/soqlToDomain'
import { buildLeaseUpModel } from './leaseUpModel'

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

const mapProperties = ({ listing, applications }) => {
  return  {
    listing: mapListingDetails(listing),
    applications: applications.map(flow(mapApplicationPreference, buildLeaseUpModel))
  }
}

export default mapProps(mapProperties)(LeaseUpsPage)
