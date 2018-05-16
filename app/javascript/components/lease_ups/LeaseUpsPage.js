import React from 'react'

import PageHeader from '../organisms/PageHeader'
import PageHeaderSimple from '../organisms/PageHeaderSimple'
import LeaseUpsTableContainer from './LeaseUpsTableContainer'

const LeaseUpsPageHeader = ({ listing }) => {
  if (listing) {
    return (
      <div>
        <PageHeader
          title={listing.Name}
          content={listing.Building_Street_Address}
          action={{title: 'Export', link: `/listings/${listing.Id}/lease_ups/export`}}
          breadcrumbs={[
            {title: 'Lease Ups', link: '/lease_ups'},
            {title: listing.Name, link: `/listings/${listing.Id}/lease_ups`}
          ]} />
      </div>
    )
  } else {
    return (
      <div>
        <PageHeaderSimple title='Lease Ups' />
      </div>
    )
  }
}

const LeaseUpsPage = ({ listing, results }) => {
  if (listing) {
    return (
      <div>
        <LeaseUpsPageHeader listing={listing} />
        <LeaseUpsTableContainer listing={listing} results={results} />
      </div>
    )
  } else {
    return (
      <div>
        <LeaseUpsPageHeader />
        {/* TODO: implement Lease Ups page content */}
      </div>
    )
  }
}

export default LeaseUpsPage
