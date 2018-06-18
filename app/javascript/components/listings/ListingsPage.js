import React from 'react'

import IndexTable from '../IndexTable'
import TableLayout from '../layouts/TableLayout'
import mapProps from '~/utils/mapProps'

const ListingsPageTable = ({ page, listings, fields }) => {
  return (
    <IndexTable
      page={page}
      results={listings}
      fields= {fields}
      links={['View Listing', 'Add Application', 'Lease Ups'] } />
  )
}

const layout = {
  pageHeader: {
    title: 'Listings'
  }
}

const ListingsPage = ({ page, listings, fields}) => {
  return (
    <TableLayout {...layout}>
      <ListingsPageTable page={page} listings={listings} fields={fields} />
    </TableLayout>
  )
}

const mapProperties = ({ page, listings, fields}) => {
  // console.log(JSON.stringify(fields))
  return {
    page: page,
    listings: listings, // TODO: use mapper here
    fields: fields
  }
}

export default mapProps(mapProperties)(ListingsPage)
