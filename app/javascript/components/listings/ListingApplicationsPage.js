import React from 'react'

import TableLayout from '../layouts/TableLayout'
import mapProps from 'utils/mapProps'
import { fetchApplications } from '../applications/actions'
import ApplicationsTableContainer from '../applications/ApplicationsTableContainer'
import appPaths from 'utils/appPaths'

const ListingApplicationsPage = ({ listing }) => {
  const filters = { listing_id: listing.id }
  const pageHeader = {
    title: listing.name
  }

  const tabs = {
    items: [
      { title: 'Listing Details', url: appPaths.toListing(listing.id) },
      { title: 'Applications', url: appPaths.toApplications(listing.id), active: true }
    ]
  }

  return (
    <TableLayout pageHeader={pageHeader} tabSection={tabs}>
      <ApplicationsTableContainer
        listings={[listing]}
        onFetchData={fetchApplications}
        filters={filters}
      />
    </TableLayout>
  )
}

const mapProperties = ({ listing }) => {
  return {
    listing,
    onFetchData: fetchApplications
  }
}

export default mapProps(mapProperties)(ListingApplicationsPage)
