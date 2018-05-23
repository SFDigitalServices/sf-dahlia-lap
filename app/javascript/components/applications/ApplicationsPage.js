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

const layout = {
  pageHeader: {
    title: 'Applications'
  }
}

const ApplicationsPage = (props) => {
  return (
    <TableLayout {...layout}>
      <ApplicationsPageTable {...props} />
    </TableLayout>
  )
}

export default ApplicationsPage
