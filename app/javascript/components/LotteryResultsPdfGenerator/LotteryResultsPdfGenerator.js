import React, { useEffect, useState } from 'react'

import apiService from 'apiService'
import TableLayout from 'components/layouts/TableLayout'
import Loading from 'components/molecules/Loading'
import appPaths from 'utils/appPaths'

import DropTarget from './components/DropTarget'
import LotteryManager from './components/LotteryManager'

// const processDrop = async (files) => {
//   const [file] = files
//   return await file.arrayBuffer()
// }

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
  // const [showDropTarget, setShowDropTarget] = useState(false)
  // const [spreadsheetData, setSpreadsheetData] = useState()
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

  // const handleDragEnter = (event) => {
  //   // don't show the drop target if the user is not dragging a file
  //   if (event.dataTransfer.types.includes('Files')) {
  //     setShowDropTarget(true)

  //     // we have to prevent the default dragEnter behavior so the drop works
  //     event.preventDefault()
  //   }
  // }

  // const handleDragLeave = () => setShowDropTarget(false)

  // const handleDrop = async (event) => {
  //   event.preventDefault()
  //   setShowDropTarget(false)

  //   if (event.dataTransfer.types.includes('Files')) {
  //     const data = await processDrop(event.dataTransfer.files)

  //     setSpreadsheetData(data)
  //   }
  // }

  return (
    <>
      {listing ? (
        <TableLayout pageHeader={getPageHeaderData(listing)} tabSection={tabs}>
          {applications ? (
            <LotteryManager applications={applications} listing={listing} />
          ) : (
            <Loading isLoading />
          )}
        </TableLayout>
      ) : (
        <Loading isLoading />
      )}
    </>
  )
  // <div id='lottery-results-pdf-generator-container' onDragEnter={handleDragEnter}>
  //   {showDropTarget ? (
  //     <DropTarget onDrop={handleDrop} onLeave={handleDragLeave} />
  //   ) : spreadsheetData ? (
  //     <LotteryManager spreadsheetData={applications} />
  //   ) : (
  //     <div id='lottery-results-pre-drop-message'>
  //       <div>Drag and drop a .xlsx results spreadsheet here</div>
  //     </div>
  //   )}
  // </div>
}

export default LotteryResultsPdfGenerator
