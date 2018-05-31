import React from 'react'

import IndexTable from '../../IndexTable'
import TableLayout from '../../layouts/TableLayout'

const FlaggedApplicationsIndexPageTable = ({ results, fields }) => {
  return (
    <div>
      <IndexTable
        results={results}
        fields={fields}
        links={['View Flagged Applications']} />
    </div>
  )
}

const FlaggedApplicationsIndexPage = ({title, ...props}) => {
  return (
    <TableLayout pageHeader={{title: title}}>
      <FlaggedApplicationsIndexPageTable {...props} />
    </TableLayout>
  )
}

export default FlaggedApplicationsIndexPage
