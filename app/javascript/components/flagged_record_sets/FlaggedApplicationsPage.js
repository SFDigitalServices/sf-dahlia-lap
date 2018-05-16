import React from 'react'

import PageHeaderSimple from '../organisms/PageHeaderSimple'
import SpreadsheetIndexTable from '../SpreadsheetIndexTable'

const FlaggedApplicationsHeader = ({}) => {
  return (
    <div>
      <PageHeaderSimple title='Flagged Application Set' />
    </div>
  )
}

const FlaggedApplicationsTable = ({ results, fields }) => {
  return (
    /* TODO: could render normal IndexTable for this record set if Lottery Complete, so not editable */
    <SpreadsheetIndexTable
      results={results}
      fields= {fields} />
  )
}

const FlaggedApplicationsPage = (props) => {
  return (
    <div>
      <FlaggedApplicationsHeader/>
      <FlaggedApplicationsTable {...props} />
    </div>
  )
}

export default FlaggedApplicationsPage
