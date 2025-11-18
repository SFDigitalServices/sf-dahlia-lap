import React, { useState } from 'react'

import ErrorBoundary from 'components/atoms/ErrorBoundary'
import { listingsPageMounted, listingRowClicked } from 'components/lease_ups/actions/actionCreators'
import Loading from 'components/molecules/Loading'
import appPaths from 'utils/appPaths'
import { useAppContext, useAsyncOnMount } from 'utils/customHooks'
import { useFeatureFlag } from 'utils/hooks/useFeatureFlag'

import LeaseUpListingsTable from './LeaseUpListingsTable'
import { getLeaseUpListings } from './utils/leaseUpRequestUtils'
import TableLayout from '../layouts/TableLayout'

const LeaseUpListingsPage = () => {
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

  const { unleashFlag: testFlag } = useFeatureFlag('test-partners', false)

  const onCellClick = ({ original: listing }) => {
    listingRowClicked(dispatch, listing)
    window.location.assign(appPaths.toLeaseUpApplications(listing.id))
  }

  return (
    <ErrorBoundary>
      {testFlag && <div style={{ display: 'none' }}>Test Unleash flag is enabled</div>}
      <TableLayout pageHeader={pageHeader}>
        {loading ? (
          <Loading isLoading />
        ) : (
          <LeaseUpListingsTable listings={listings} onCellClick={onCellClick} />
        )}
      </TableLayout>
    </ErrorBoundary>
  )
}

export default LeaseUpListingsPage
