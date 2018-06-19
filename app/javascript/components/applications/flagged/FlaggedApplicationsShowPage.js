import React from 'react'

import SpreadsheetIndexTable from '../../SpreadsheetIndexTable'
import TableLayout from '../../layouts/TableLayout'
import mapProps from '~/utils/mapProps'

const FlaggedApplicationsShowPageTable = ({ flaggedApplications, fields }) => {
  return (
    /* TODO: could render normal IndexTable for this record set if Lottery Complete, so not editable */
    <SpreadsheetIndexTable
      results={flaggedApplications}
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

const mapProperties = ({ flaggedApplications, fields }) => {
  return {
    flaggedApplications, // TODO: map here
    fields
  }
}

export default mapProps(mapProperties)(FlaggedApplicationsShowPage)
