import React from 'react'

import PageHeader from '../organisms/PageHeader'
import LeaseUpsTableContainer from './LeaseUpsTableContainer'

const LeaseUpsPage = ({ listing, results }) => {
  return (
    <div>
    	<PageHeader
    	  title={listing.Name}
    	  content={listing.Building_Street_Address}
    	  action={{ title: 'Export', link: `/listings/${listing.Id}/lease_ups/export` }}
    	  breadcrumbs={[
    	    { title: 'Lease Ups', link: '/lease_ups' },
    	    { title: listing.Name, link: `/listings/${listing.Id}/lease_ups` }
    	  ]}/>
      <LeaseUpsTableContainer listing={listing} results={results} />
    </div>
  )
}

export default LeaseUpsPage
