import React from 'react'

import IndexTable from '../IndexTable'

const ListingsTable = ({ listings, fields }) => {
  return (
    <IndexTable
      results={listings}
      fields= {fields}
      links={['View Listing', 'Add Application', 'Lease Ups'] } />
  )
}

export default ListingsTable
