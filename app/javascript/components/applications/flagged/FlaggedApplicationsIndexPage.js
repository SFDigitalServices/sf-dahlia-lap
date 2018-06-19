import React from 'react'

import IndexTable from '../../IndexTable'
import TableLayout from '../../layouts/TableLayout'
import mapProps from '~/utils/mapProps'
import { mapFlaggedRecords } from '~/components/mappers/soqlToDomain'

const tableFields = {
  "id":null,
  "listing_name":{
    "label":"Listing Name"
  },
  "rule_name":{
    "label":"Rule Name"
  },
  "total_number_of_pending_review":{
    "label":"Total Number of Pending Review"
  },
  "total_number_of_appealed":{
    "label":"Total Number of Appealed"
  },
}

const FlaggedApplicationsIndexTable = ({ flaggedRecords, fields }) => {
  return <IndexTable
          results={flaggedRecords}
          fields={fields}
          links={['View Flagged Applications']} />
}

const FlaggedApplicationsIndexPage = ({title, flaggedRecords, fields}) => {
  return (
    <TableLayout pageHeader={{title: title}}>
      <FlaggedApplicationsIndexTable flaggedRecords={flaggedRecords} fields={tableFields} />
    </TableLayout>
  )
}

const mapProperties = ({title, flaggedRecords }) => {
  return {
    title,
    flaggedRecords: flaggedRecords.map(mapFlaggedRecords)
  }
}

export default mapProps(mapProperties)(FlaggedApplicationsIndexPage)
