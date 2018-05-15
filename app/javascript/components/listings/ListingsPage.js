import React from 'react'

import PageHeaderSimple from '../organisms/PageHeaderSimple'
import ListingsTable from './ListingsTable'

const ListingHeader = ({}) => {
  return (
    <div>
      <PageHeaderSimple title='Listings' />
    </div>
  )
}

const ListingsPage = (props) => {
  return (
    <div>
      <ListingHeader/>
      <ListingsTable {...props} />
    </div>
  )
}

export default ListingsPage
