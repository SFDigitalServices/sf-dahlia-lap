import React, { useContext, useState } from 'react'

import { withRouter } from 'react-router-dom'

import Loading from 'components/molecules/Loading'
import { listingsPageMounted, listingRowClicked } from 'context/actionCreators/actionCreators'
import { AppContext } from 'context/Provider'
import appPaths from 'utils/appPaths'
import { useAsyncOnMount } from 'utils/customHooks'

import TableLayout from '../layouts/TableLayout'
import { getLeaseUpListings } from './leaseUpActions'
import LeaseUpListingsTable from './LeaseUpListingsTable'

const LeaseUpListingsPage = ({ history }) => {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(true)

  const [, dispatch] = useContext(AppContext)

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
