import React, { useState } from 'react'

import { withRouter } from 'react-router-dom'

import { listingsPageMounted, listingRowClicked } from 'components/lease_ups/actions/actionCreators'
import Loading from 'components/molecules/Loading'
import appPaths from 'utils/appPaths'
import { useAppContext, useAsyncOnMount } from 'utils/customHooks'

import TableLayout from '../layouts/TableLayout'
import LeaseUpListingsTable from './LeaseUpListingsTable'
import { getLeaseUpListings } from './utils/leaseUpRequestUtils'

const LeaseUpListingsPage = ({ history }) => {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(true)

  const [, dispatch] = useAppContext()

  useAsyncOnMount(
    () => {
      listingsPageMounted(dispatch)
      return getLeaseUpListings()
    },
    {
      onSuccess: (responseListings) => setListings(responseListings),
      onComplete: () => setLoading(false)
    }
  )

  const pageHeader = {
    title: 'Lease Ups'
  }

  const onCellClick = ({ original: listing }) => {
    listingRowClicked(dispatch, listing)

    history.push(appPaths.toLeaseUpApplications(listing.id))
  }

  return (
    <TableLayout pageHeader={pageHeader}>
      {loading ? (
        <Loading isLoading />
      ) : (
        <LeaseUpListingsTable listings={listings} onCellClick={onCellClick} />
      )}
    </TableLayout>
  )
}

export default withRouter(LeaseUpListingsPage)
