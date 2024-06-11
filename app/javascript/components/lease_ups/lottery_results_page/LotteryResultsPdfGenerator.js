import React, { useEffect, useState } from 'react'

import apiService from 'apiService'
import TableLayout from 'components/layouts/TableLayout'
import Loading from 'components/molecules/Loading'
import appPaths from 'utils/appPaths'

import LotteryManager from './LotteryManager'

const getPageHeaderData = (listing) => {
  return {
    title: listing?.name || <span>&nbsp;</span>,
    content: listing?.buildingAddress || '',
    breadcrumbs: [
      {
        title: 'Lease Ups',
        link: appPaths.toLeaseUps()
      },
      listing.name
        ? {
            title: listing.name,
            link: appPaths.toLeaseUpApplications(listing.id)
          }
        : {
          title: '',
          link: '#'
        }
    ]
  }
}

const LotteryResultsPdfGenerator = (props) => {
  const [applications, setApplications] = useState()
  const [listing, setListing] = useState()

  const tabs = {
    items: [
      { title: 'Applications', url: appPaths.toLeaseUpApplications(props.listing_id) },
      {
        title: 'Lottery Results',
        url: appPaths.toLotteryResults(props.listing_id),
        active: true
      }
    ]
  }

  useEffect(() => {
    apiService.fetchApplicationsForLotteryResults(props.listing_id).then((res) => {
      setApplications(res.records)
    })

    apiService.getLeaseUpListing(props.listing_id).then((res) => setListing(res))
  }, [props.listing_id])

  return (
    <>
      {listing ? (
        <TableLayout pageHeader={getPageHeaderData(listing)} tabSection={tabs}>
            <LotteryManager applicationPrefs={applications} listing={listing} />
        </TableLayout>
      ) : (
        <Loading isLoading />
      )}
    </>
  )
}

export default LotteryResultsPdfGenerator
