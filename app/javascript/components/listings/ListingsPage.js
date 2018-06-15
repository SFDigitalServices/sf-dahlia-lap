import React from 'react'

import IndexTable from '../IndexTable'
import TableLayout from '../layouts/TableLayout'
import mapProps from '~/utils/mapProps'

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

const ListingsPage = ({ page, results, fields}) => {
  return (
    <TableLayout {...layout}>
      <ListingsPageTable page={page} results={results} fields={fields} />
    </TableLayout>
  )
}

const mapProperties = ({ page, results, fields}) => {
  return {
    page: page,
    results: results, // TODO: use mapper here
    fields: fields
  }
}

export default mapProps(mapProperties)(ListingsPage)
