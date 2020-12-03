import React, { useContext, useEffect, useState } from 'react'

import { withRouter } from 'react-router-dom'

import Loading from 'components/molecules/Loading'
import { onListingRowClicked } from 'stores/leaseUpActionCreators'
import { LeaseUpDispatchContext } from 'stores/LeaseUpProvider'
import appPaths from 'utils/appPaths'

import TableLayout from '../layouts/TableLayout'
import { getLeaseUpListings } from './leaseUpActions'
import LeaseUpListingsTable from './LeaseUpListingsTable'

const LeaseUpListingsPage = ({ history }) => {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(true)

  const dispatch = useContext(LeaseUpDispatchContext)

  useEffect(() => {
    getLeaseUpListings()
      .then((responseListings) => setListings(responseListings))
      .finally(() => setLoading(false))
  }, [])

  const pageHeader = {
    title: 'Lease Ups'
  }

  const onCellClick = ({ original: listing }) => {
    onListingRowClicked(dispatch, listing)

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
