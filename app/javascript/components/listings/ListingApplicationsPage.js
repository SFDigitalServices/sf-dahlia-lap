import React from 'react'

import appPaths from 'utils/appPaths'
import mapProps from 'utils/mapProps'

import { fetchApplications } from '../applications/applicationRequestUtils'
import ApplicationsTableContainer from '../applications/ApplicationsTableContainer'
import TableLayout from '../layouts/TableLayout'

const ListingApplicationsPage = ({ listing, user_is_admin }) => {
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

  if (user_is_admin) {
    tabs.items.push({ title: 'Lottery Results', url: appPaths.toLotteryResults(listing.id) })
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

const mapProperties = ({ listing, user_is_admin }) => {
  return {
    listing,
    user_is_admin,
    onFetchData: fetchApplications
  }
}

export default mapProps(mapProperties)(ListingApplicationsPage)
