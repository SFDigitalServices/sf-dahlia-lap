import React, { useEffect, useState } from 'react'

import appPaths from '~/utils/appPaths'
import Loading from '~/components/molecules/Loading'
import { getLeaseUpListings } from './leaseUpActions'

import TableLayout from '../layouts/TableLayout'
import LeaseUpListingsTable from './LeaseUpListingsTable'

const LeaseUpListingsPage = () => {
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
    window.location.href = appPaths.toLeaseUpApplications(rowInfo.original.id)
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
