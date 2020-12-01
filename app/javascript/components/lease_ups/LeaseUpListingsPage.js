import React, { useContext, useEffect, useState } from 'react'

import { withRouter } from 'react-router-dom'

import Loading from 'components/molecules/Loading'
import { LeaseUpContext } from 'stores/LeaseUpProvider'
import appPaths from 'utils/appPaths'

import TableLayout from '../layouts/TableLayout'
import { getLeaseUpListings } from './leaseUpActions'
import LeaseUpListingsTable from './LeaseUpListingsTable'

const LeaseUpListingsPage = ({ history }) => {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(true)

  const { dispatch } = useContext(LeaseUpContext)

  useEffect(() => {
    getLeaseUpListings()
      .then((responseListings) => setListings(responseListings))
      .finally(() => setLoading(false))
  }, [])

  const pageHeader = {
    title: 'Lease Ups'
  }

  const onCellClick = (rowInfo) => {
    dispatch({ type: 'INCREMENT' })
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
