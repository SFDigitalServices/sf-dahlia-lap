import React from 'react'
import { flow } from 'lodash'

import LeaseUpApplicationsTableContainer from './LeaseUpApplicationsTableContainer'
import TableLayout from '../layouts/TableLayout'
import mapProps from '~/utils/mapProps'
import { mapListing, mapApplicationPreference } from '~/components/mappers/soqlToDomain'
import { buildLeaseUpModel } from './leaseUpModel'
import appPaths from '~/utils/appPaths'

const LeaseUpApplicationsPage = ({ listing, applications }) => {
  const pageHeader = {
    title: listing.name,
    content: listing.building_street_address,
    action: {
      title: 'Export',
      link: `/listings/${listing.id}/lease-ups/export`
    },
    breadcrumbs: [
      {title: 'Lease Ups', link: '/listings/lease-ups'},
      {title: listing.name, link: appPaths.toLeaseUpApplications(listing.id)}
    ]
  }

  return (
    <TableLayout pageHeader={pageHeader}>
      <LeaseUpApplicationsTableContainer listing={listing} applications={applications} />
    </TableLayout>
  )
}

const mapProperties = ({ listing, applications }) => {
  return {
    listing: mapListing(listing),
    applications: applications.map(flow(mapApplicationPreference, buildLeaseUpModel))
  }
}

export default mapProps(mapProperties)(LeaseUpApplicationsPage)
