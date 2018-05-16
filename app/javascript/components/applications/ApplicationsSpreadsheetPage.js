import React from 'react'

import PageHeaderSimple from '../organisms/PageHeaderSimple'
import SpreadsheetIndexTable from '../SpreadsheetIndexTable'

const ApplicationsSpreadsheetPageHeader = ({}) => {
  return (
    <div>
      <PageHeaderSimple title='Applications Spreadsheet' />
    </div>
  )
}

const ApplicationsSpreadsheetPageTable = ({ results, fields }) => {
  return (
    <SpreadsheetIndexTable
      results={results}
      fields= {fields} />
  )
}

const ApplicationsSpreadsheetPage = (props) => {
  return (
    <div>
      <ApplicationsSpreadsheetPageHeader/>
      <ApplicationsSpreadsheetPageTable {...props} />
    </div>
  )
}

export default ApplicationsSpreadsheetPage
