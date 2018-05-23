import React from 'react'

import PageHeaderSimple from '../organisms/PageHeaderSimple'
import IndexTable from '../IndexTable'

const ListingApplicationsHeader = ({ listing }) => {
  return (
    <div>
      <PageHeaderSimple title={listing.Name} />
    </div>
  )
}

const ListingApplicationsTable = ({ listing, results, fields }) => {
  return (
    <IndexTable
      results={results}
      fields= {fields}
      links={['View Application'] } />
  )
}

const ListingApplicationsPage = (props) => {
  return (
    <div>
      <ListingApplicationsHeader {...props}/>
      <ListingApplicationsTable {...props} />
    </div>
  )
}

export default ListingApplicationsPage
