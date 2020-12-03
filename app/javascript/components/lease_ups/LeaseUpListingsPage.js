import React, { useContext, useState } from 'react'

import { withRouter } from 'react-router-dom'

import Loading from 'components/molecules/Loading'
import { AppContext } from 'context/Provider'
import appPaths from 'utils/appPaths'
import { useEffectOnMount } from 'utils/customHooks'

import TableLayout from '../layouts/TableLayout'
import { getLeaseUpListings } from './leaseUpActions'
import LeaseUpListingsTable from './LeaseUpListingsTable'

const LeaseUpListingsPage = ({ history }) => {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(true)

  const [, actions] = useContext(AppContext)

  useEffectOnMount(() => {
    actions.listingsPageMounted()
    getLeaseUpListings()
      .then((responseListings) => setListings(responseListings))
      .finally(() => setLoading(false))
  })

  const pageHeader = {
    title: 'Lease Ups'
  }

  const onCellClick = ({ original: listing }) => {
    actions.listingRowClicked(listing)

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
