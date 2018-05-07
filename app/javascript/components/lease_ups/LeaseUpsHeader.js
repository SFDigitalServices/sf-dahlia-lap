import React from 'react'

import PageHeader from '../organisms/PageHeader'

const LeaseUpsHeader = ({ listing }) => (

  <PageHeader
    title={listing.Name}
    content={listing.Building_Street_Address}
    action={{ title: 'Export', link: `/listings/${listing.Id}/lease_ups/export` }}
    breadcrumbs={[
      { title: 'Lease Ups', link: '/lease_ups' },
      { title: listing.Name, link: `/listings/${listing.Id}/lease_ups` }
    ]}/>
)

export default LeaseUpsHeader
