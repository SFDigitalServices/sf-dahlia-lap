import React from 'react'

import SpreadsheetIndexTable from '../../SpreadsheetIndexTable'
import TableLayout from '../../layouts/TableLayout'
import mapProps from '~/utils/mapProps'

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

const mapProperties = ({ results, fields }) => {
  return {
    results, // TODO: map here
    fields
  }
}

export default mapProps(mapProperties)(FlaggedApplicationsShowPage)
