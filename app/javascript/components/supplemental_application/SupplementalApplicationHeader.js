import React from 'react'

import PageHeader from '../organisms/PageHeader'
import appPaths from '../../utils/appPaths'

const SupplementalApplicationHeader = ({ applicationNumber, applicantName, listing }) => {
  const title = `${applicationNumber}: ${applicantName}`
  const breadcrumbs = [
    { title: 'Lease Ups', link: '/lease_ups' },
    { title: listing.Name, link: appPaths.toListingLeaseUps(listing.Id) },
    { title: applicationNumber, link: '#' }
  ]

  return (
    <PageHeader title={title} breadcrumbs={breadcrumbs}  />
  )
}

export default SupplementalApplicationHeader
