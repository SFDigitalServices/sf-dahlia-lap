import React from 'react'

import PageHeaderSimple from '../organisms/PageHeaderSimple'
import IndexTable from '../IndexTable'

const ListingsPageHeader = ({}) => {
  return (
    <div>
      <PageHeaderSimple title='Listings' />
    </div>
  )
}

const ListingsPageTable = ({ page, results, fields }) => {
  return (
    <IndexTable
      page={page}
      results={results}
      fields= {fields}
      links={['View Listing', 'Add Application', 'Lease Ups'] } />
  )
}

const ListingsPage = (props) => {
  return (
    <div>
      <ListingsPageHeader/>
      <ListingsPageTable {...props} />
    </div>
  )
}

export default ListingsPage
