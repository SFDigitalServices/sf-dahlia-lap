import React from 'react'

import PageHeader from '../organisms/PageHeader'
import appPaths from '~/utils/appPaths'

const SupplementalApplicationHeader = ({ applicationNumber, applicantName, listing }) => {
  const title = `${applicationNumber}: ${applicantName}`
  const breadcrumbs = [
    { title: 'Lease Ups', link: '/listings/lease-ups' },
    { title: listing.name, link: appPaths.toListingLeaseUps(listing.id) },
    { title: applicationNumber, link: '#' }
  ]

  return (
    <PageHeader title={title} breadcrumbs={breadcrumbs}  />
  )
}

export default SupplementalApplicationHeader
