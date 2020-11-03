import React, { useEffect, useState } from 'react'

import appPaths from 'utils/appPaths'
import Loading from 'components/molecules/Loading'
import { getLeaseUpListings } from './leaseUpActions'

import TableLayout from '../layouts/TableLayout'
import LeaseUpListingsTable from './LeaseUpListingsTable'
import { withRouter } from 'react-router-dom'

const LeaseUpListingsPage = ({ history }) => {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(true)

  useEffect(() => {
    getLeaseUpListings()
      .then((responseListings) => setListings(responseListings))
      .finally(() => setLoading(false))
  }, [])

  const pageHeader = {
    title: 'Lease Ups'
  }

  const onCellClick = (rowInfo) => {
    history.push(appPaths.toLeaseUpApplications(rowInfo.original.id))
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
