import React from 'react'

import IndexTable from '../IndexTable'
import TableLayout from '../layouts/TableLayout'
import mapProps from '~/utils/mapProps'

const ListingApplicationsTable = ({ results, fields }) => {
  console.log(JSON.stringify(results))
  console.log(JSON.stringify(fields))
  return (
    <IndexTable
      results={results}
      fields= {fields}
      links={['View Application'] } />
  )
}

const ListingApplicationsPage = ({listing, results, fields }) => {
  const pageHeader = {
    title: listing.Name
  }

  const tabs = {
    items: [
      { title: 'Listing Details', url: `/listings/${listing.Id}` },
      { title: 'Applications',    url: `/listings/${listing.Id}/applications`  }
    ],
    currentUrl:window.location.pathname
  }

  return (
    <TableLayout pageHeader={pageHeader} tabSection={tabs}>
      <ListingApplicationsTable results={results} fields={fields} />
    </TableLayout>
  )
}

const mapProperties = ({listing, results, fields }) => {
  return {}
  // return {
  //   listing: listing,
  //   results: results, // TODO: use mapper here
  //   fields: fields
  // }
}

// export default mapProps(mapProperties)(ListingApplicationsPage)
export default ListingApplicationsPage
