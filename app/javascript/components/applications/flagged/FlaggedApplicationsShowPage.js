import React from 'react'

// import PageHeaderSimple from '../../organisms/PageHeaderSimple'
import SpreadsheetIndexTable from '../../SpreadsheetIndexTable'
import TableLayout from '../../layouts/TableLayout'

// const FlaggedApplicationsShowPageHeader = ({}) => {
//   return (
//     <div>
//       <PageHeaderSimple title='Flagged Application Set' />
//     </div>
//   )
// }

const FlaggedApplicationsShowPageTable = ({ results, fields }) => {
  return (
    /* TODO: could render normal IndexTable for this record set if Lottery Complete, so not editable */
    <SpreadsheetIndexTable
      results={results}
      fields= {fields} />
  )
}

const FlaggedApplicationsShowPage = (props) => {
  const pageHeader = {
      title: 'Flagged Application Set'
  }

  return (
    <TableLayout pageHeader={pageHeader}>
      <FlaggedApplicationsShowPageTable {...props} />
    </TableLayout>
  )
}

export default FlaggedApplicationsShowPage
