import React from 'react'

import appPaths from 'utils/appPaths'

import PageHeader from '../organisms/PageHeader'

const SupplementalApplicationHeader = ({ applicationNumber, applicantName, listing }) => {
  const title = `${applicationNumber}: ${applicantName}`
  const breadcrumbs = [
    { title: 'Lease Ups', link: appPaths.toLeaseUps(), renderAsRouterLink: true },
    { title: listing.name, link: appPaths.toListingLeaseUps(listing.id), renderAsRouterLink: true },
    { title: applicationNumber, link: '#' }
  ]

  return <PageHeader title={title} breadcrumbs={breadcrumbs} />
}

export default SupplementalApplicationHeader
