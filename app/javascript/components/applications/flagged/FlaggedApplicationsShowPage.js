import React from 'react'

import SpreadsheetIndexTable from '../../SpreadsheetIndexTable'
import TableLayout from '../../layouts/TableLayout'
import mapProps from '~/utils/mapProps'

const tableFields = {
  "Id": null,
  "Application": null,
  "Application.Name": {
    "label": "App Number"
  },
  "Flagged_Record_Set.Rule_Name": null,
  "Primary_Application_Applicant_Name": {
    "label": "Primary Applicant Name"
  },
  "Flagged_Record_Set.Listing.Lottery_Status": {
    "label": "Lottery Status"
  },
  "Review_Status": {
    "editable": true,
    "editable_options": [
      "Pending Review",
      "Reviewed - Keep in Lottery",
      "Reviewed - Remove from Lottery",
      "Appealed"
    ]
  },
  "Comments": {
    "editable": true
  }
}

const FlaggedApplicationsShowPageTable = ({ flaggedApplications }) => {
  return (
    /* TODO: could render normal IndexTable for this record set if Lottery Complete, so not editable */
    <SpreadsheetIndexTable
      results={flaggedApplications}
      fields= {tableFields} />
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
  // console.log(JSON.stringify(flaggedApplications))
  return {
    flaggedApplications, // TODO: map here
  }
}

export default mapProps(mapProperties)(FlaggedApplicationsShowPage)
