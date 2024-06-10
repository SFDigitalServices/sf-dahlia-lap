import React, { useEffect, useState } from 'react'

import apiService from 'apiService'
import TableLayout from 'components/layouts/TableLayout'
import Loading from 'components/molecules/Loading'
import appPaths from 'utils/appPaths'

import LotteryManager from './LotteryManager'

const getPageHeaderData = (listing) => {
  const levelAboveBreadcrumb = {
    title: 'Lease Ups',
    link: appPaths.toLeaseUps()
  }

  const emptyBreadCrumb = {
    title: '',
    link: '#'
  }

  const breadcrumbs = [
    levelAboveBreadcrumb,
    listing.name
      ? {
          title: listing.name,
          link: appPaths.toLeaseUpApplications(listing.id)
        }
      : emptyBreadCrumb
  ]

  return {
    title: listing?.name || <span>&nbsp;</span>,
    content: listing?.buildingAddress || '',
    breadcrumbs
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
          {applications ? (
            <LotteryManager applicationPrefs={applications} listing={listing} />
          ) : (
            <Loading isLoading />
          )}
        </TableLayout>
      ) : (
        <Loading isLoading />
      )}
    </>
  )
}

export default LotteryResultsPdfGenerator
