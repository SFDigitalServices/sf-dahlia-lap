import React from 'react'

import PageHeader from '../organisms/PageHeader'

const SupplementalApplicationHeader = ({ applicationId, applicantName, listingId }) => {
  const title = `${applicationId}: ${applicantName}`
  const breadcrumbs = [
    { title: 'Lease Ups', link: '/lease_ups' },
    { title: 'Cameo Apartments', link: `/listings/${listingId}/lease_ups` },
    { title: applicationId, link: '#' }
  ]

  return (
    <PageHeader title={title} breadcrumbs={breadcrumbs}  />
  )
}

export default SupplementalApplicationHeader
