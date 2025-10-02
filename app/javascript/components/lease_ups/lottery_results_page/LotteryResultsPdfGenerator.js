import React, { useMemo } from 'react'

import TableLayout from 'components/layouts/TableLayout'
import Loading from 'components/molecules/Loading'
import { useLeaseUpListing, useLotteryApplications } from 'query/hooks/useLeaseUpQueries'
import appPaths from 'utils/appPaths'

import LotteryManager from './LotteryManager'

const getPageHeaderData = (listing) => {
  return {
    title: listing?.name || <span>&nbsp;</span>
  }
}

const getTabs = (listingId) => {
  return {
    items: [
      { title: 'Listing Details', url: appPaths.toListing(listingId) },
      { title: 'Applications', url: appPaths.toApplications(listingId) },
      { title: 'Lottery Results', url: appPaths.toLotteryResults(listingId), active: true }
    ]
  }
}

const LotteryResultsPdfGenerator = (props) => {
  const listingId = props.listing_id
  const useLotteryApi = useMemo(
    () => new URLSearchParams(window.location.search).has('withLotteryResultApi'),
    []
  )

  const {
    data: listing,
    isLoading: isListingLoading,
    isError: isListingError
  } = useLeaseUpListing(listingId)

  const {
    data: applications,
    isLoading: isApplicationsLoading,
    isError: isApplicationsError
  } = useLotteryApplications({ listingId, useLotteryApi })

  const isLoading = isListingLoading || isApplicationsLoading
  const hasError = isListingError || isApplicationsError

  if (isLoading) {
    return <Loading isLoading />
  }

  if (hasError || !listing) {
    return (
      <TableLayout pageHeader={getPageHeaderData(listing || {})} tabSection={getTabs(listingId)}>
        <div className='usa-alert usa-alert--error'>Unable to load lottery results.</div>
      </TableLayout>
    )
  }

  return (
    <TableLayout pageHeader={getPageHeaderData(listing)} tabSection={getTabs(listingId)}>
      <LotteryManager
        applications={applications}
        listing={listing}
        withLotteryResultApi={useLotteryApi}
      />
    </TableLayout>
  )
}

export default LotteryResultsPdfGenerator
