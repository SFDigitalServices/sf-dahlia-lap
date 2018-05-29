import React from 'react'

import TableLayout from '../layouts/TableLayout'
import IndexTable from '../IndexTable'

const ApplicationsPageTable = ({ applications, fields }) => {
  return (
    <IndexTable
      results={applications}
      fields= {fields}
      links={['View Application'] } />
  )
}

const ApplicationsPage = (props) => {
  const pageHeader = {
    title: 'Applications'
  }

  return (
    <TableLayout pageHeader={pageHeader} >
      <ApplicationsPageTable {...props} />
    </TableLayout>
  )
}

export default ApplicationsPage
