import React from 'react'

import TableLayout from '../layouts/TableLayout'
import mapProps from '~/utils/mapProps'
import { fetchApplications } from '../applications/actions'
import ApplicationsTableContainer from '../applications/ApplicationsTableContainer'

const ListingApplicationsPage = ({ listing }) => {
  const filters = { listing_id: listing.id }
  const pageHeader = {
    title: listing.name
  }

  const tabs = {
    items: [
      { title: 'Listing Details', url: `/listings/${listing.id}` },
      { title: 'Applications', url: `/listings/${listing.id}/applications`, active: true }
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
