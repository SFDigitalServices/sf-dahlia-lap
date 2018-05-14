import React from 'react'

import PageHeader from '../organisms/PageHeader'

const SupplementalApplicationHeader = ({ applicationNumber, applicantName, listingId }) => {
  const title = `${applicationNumber}: ${applicantName}`
  const breadcrumbs = [
    { title: 'Lease Ups', link: '/lease_ups' },
    { title: 'Cameo Apartments', link: `/listings/${listingId}/lease_ups` },
    { title: applicationNumber, link: '#' }
  ]

  return (
    <PageHeader title={title} breadcrumbs={breadcrumbs}  />
  )
}

export default SupplementalApplicationHeader
