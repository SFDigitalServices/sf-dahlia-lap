import React from 'react'
import { flow } from 'lodash'

import LeaseUpApplicationsTableContainer from './LeaseUpApplicationsTableContainer'
import TableLayout from '../layouts/TableLayout'
import mapProps from '~/utils/mapProps'
import { mapListing, mapApplicationPreference } from '~/components/mappers/soqlToDomain'
import { buildLeaseUpModel } from './leaseUpModel'

const LeaseUpApplicationsPage = ({ listing, applications }) => {
  const pageHeader = {
    title: listing.name,
    content: listing.building_street_address,
    action: {
      title: 'Export',
      link: `/listings/${listing.id}/lease-ups/export`
    },
    breadcrumbs:[
      {title: 'Lease Ups',  link: '/lease_ups'},
      {title: listing.name, link: `/listings/lease_ups/${listing.id}/applications`}
    ]
  }

  return (
    <TableLayout pageHeader={pageHeader}>
      <LeaseUpApplicationsTableContainer listing={listing} applications={applications} />
    </TableLayout>
  )
}

const mapProperties = ({ listing, applications }) => {
  return  {
    listing: mapListing(listing),
    applications: applications.map(flow(mapApplicationPreference, buildLeaseUpModel))
  }
}

export default mapProps(mapProperties)(LeaseUpApplicationsPage)
