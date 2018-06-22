import React from 'react'

import IndexTable from '../../IndexTable'
import TableLayout from '../../layouts/TableLayout'
import mapProps from '~/utils/mapProps'
import { mapFlaggedRecord } from '~/components/mappers/soqlToDomain'

const flaggedTableFields = {
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
  }
}

const duplicatedTableFields = {
  "id":null,
  "listing_name":{
    "label":"Listing Name"
  },
  "rule_name":{
    "label":"Rule Name"
  },
  "total_number_of_duplicates": {
    "label": "Total_Number_of_Duplicates"
  }
}

const FlaggedApplicationsIndexTable = ({ flaggedRecords, fields }) => {
  return <IndexTable
          results={flaggedRecords}
          fields={fields}
          links={['View Flagged Applications']} />
}

const getTableFieldsForType = (type) => {
  if (type === 'duplicated') {
    return duplicatedTableFields
  } else if (type === 'pending') {
    return flaggedTableFields
  } else {
    return null
  }
}

const FlaggedApplicationsIndexPage = ({title, flaggedRecords, type}) => {
  const tableFields = getTableFieldsForType(type)
  return (
    <TableLayout pageHeader={{title: title}}>
      <FlaggedApplicationsIndexTable
        flaggedRecords={flaggedRecords}
        fields={tableFields} />
    </TableLayout>
  )
}

const mapProperties = ({title, flaggedRecords, type }) => {
  return {
    type,
    title,
    flaggedRecords: flaggedRecords.map(mapFlaggedRecord)
  }
}

export default mapProps(mapProperties)(FlaggedApplicationsIndexPage)
