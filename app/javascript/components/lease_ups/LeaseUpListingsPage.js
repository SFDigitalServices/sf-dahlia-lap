import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { listingsPageMounted, listingRowClicked } from 'components/lease_ups/actions/actionCreators'
import Loading from 'components/molecules/Loading'
import appPaths from 'utils/appPaths'
import { useAppContext, useAsyncOnMount } from 'utils/customHooks'

import LeaseUpListingsTable from './LeaseUpListingsTable'
import { getLeaseUpListings } from './utils/leaseUpRequestUtils'
import TableLayout from '../layouts/TableLayout'

const LeaseUpListingsPage = () => {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(true)
  const navigate = useNavigate()

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

    navigate(appPaths.toLeaseUpApplications(listing.id))
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

export default LeaseUpListingsPage
