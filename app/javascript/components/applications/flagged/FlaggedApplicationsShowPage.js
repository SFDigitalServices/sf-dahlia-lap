import React from 'react'

import PageHeaderSimple from '../../organisms/PageHeaderSimple'
import SpreadsheetIndexTable from '../../SpreadsheetIndexTable'

const FlaggedApplicationsShowPageHeader = ({}) => {
  return (
    <div>
      <PageHeaderSimple title='Flagged Application Set' />
    </div>
  )
}

const FlaggedApplicationsShowPageTable = ({ results, fields }) => {
  return (
    /* TODO: could render normal IndexTable for this record set if Lottery Complete, so not editable */
    <SpreadsheetIndexTable
      results={results}
      fields= {fields} />
  )
}

const FlaggedApplicationsShowPage = (props) => {
  return (
    <div>
      <FlaggedApplicationsShowPageHeader/>
      <FlaggedApplicationsShowPageTable {...props} />
    </div>
  )
}

export default FlaggedApplicationsShowPage
