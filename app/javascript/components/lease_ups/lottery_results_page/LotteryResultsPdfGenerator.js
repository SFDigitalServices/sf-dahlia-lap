import React, { useEffect, useState } from 'react'

import apiService from 'apiService'
import TableLayout from 'components/layouts/TableLayout'
import Loading from 'components/molecules/Loading'
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
  const [applications, setApplications] = useState()
  const [listing, setListing] = useState()

  // the LotteryResult API is the source of truth: the older preference-record
  // query only returns applications that receive a preference, so it omits the
  // general lottery entirely on most listings.  ?legacy is a temporary escape
  // hatch back to that query while the two are compared.
  const withLotteryResultApi = () => !new URLSearchParams(window.location.search).has('legacy')

  useEffect(() => {
    if (withLotteryResultApi()) {
      apiService.fetchLotteryResults(props.listing_id).then((res) => {
        setApplications(res.lotteryBuckets)
      })
    } else {
      apiService.fetchApplicationsForLotteryResults(props.listing_id).then((res) => {
        setApplications(res.records)
      })
    }

    apiService.getLeaseUpListing(props.listing_id).then((res) => setListing(res))
  }, [props.listing_id])

  return (
    <>
      {listing ? (
        <TableLayout pageHeader={getPageHeaderData(listing)} tabSection={getTabs(props.listing_id)}>
          <LotteryManager
            applications={applications}
            listing={listing}
            withLotteryResultApi={withLotteryResultApi()}
          />
        </TableLayout>
      ) : (
        <Loading isLoading />
      )}
    </>
  )
}

export default LotteryResultsPdfGenerator
