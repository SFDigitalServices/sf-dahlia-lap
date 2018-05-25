import React from 'react'

import IndexTable from '../IndexTable'
import TableLayout from '../layouts/TableLayout'

const ListingsPageTable = ({ page, results, fields }) => {
  return (
    <IndexTable
      page={page}
      results={results}
      fields= {fields}
      links={['View Listing', 'Add Application', 'Lease Ups'] } />
  )
}

const layout = {
  pageHeader: {
    title: 'Listings'
  }
}

const ListingsPage = (props) => {
  return (
    <TableLayout {...layout}>
      <ListingsPageTable {...props} />
    </TableLayout>
  )
}

export default ListingsPage
