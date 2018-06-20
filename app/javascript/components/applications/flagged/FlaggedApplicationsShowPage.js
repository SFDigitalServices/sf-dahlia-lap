import React from 'react'

import SpreadsheetIndexTable from '../../SpreadsheetIndexTable'
import TableLayout from '../../layouts/TableLayout'
import mapProps from '~/utils/mapProps'
import { mapFlaggedApplication } from '~/components/mappers/soqlToDomain'

const tableFields = {
  "id": {
    "label": "Id"
  },
  "application": {
    "label": 'Application'
  },
  "application_name": {
    "label": "App Number"
  },
  "flagged_record_set_rule_name": {
    "label": "Rule Name"
  },
  "primary_application_applicant_name": {
    "label": "Primary Applicant Name"
  },
  "flagged_record_set_listing_lottery_status": {
    "label": "Lottery Status"
  },
  "review_status": {
    "label": 'Review Status',
    "editable": true,
    "editable_options": [
      "Pending Review",
      "Reviewed - Keep in Lottery",
      "Reviewed - Remove from Lottery",
      "Appealed"
    ]
  },
  "comments": {
    "label": 'Comments',
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
    flaggedApplications: flaggedApplications.map(mapFlaggedApplication)
  }
}

export default mapProps(mapProperties)(FlaggedApplicationsShowPage)
