import React from 'react'

// import PageHeaderSimple from '../organisms/PageHeaderSimple'
import IndexTable from '../IndexTable'
import TableLayout from '../layouts/TableLayout'

// const ListingsPageHeader = () => {
//   return (
//     <div>
//       <PageHeaderSimple title='Listings' />
//     </div>
//   )
// }

const ListingsPageTable = ({ page, results, fields }) => {
  return (
    <IndexTable
      page={page}
      results={results}
      fields= {fields}
      links={['View Listing', 'Add Application', 'Lease Ups'] } />
  )
}

const pageHeader = {
  title: 'Listings'
}

// <div>
//   <ListingsPageHeader/>
//   <ListingsPageTable {...props} />
// </div>

const ListingsPage = (props) => {
  return (
    <TableLayout pageHeader={pageHeader}>
      <ListingsPageTable {...props} />
    </TableLayout>

  )
}

export default ListingsPage
