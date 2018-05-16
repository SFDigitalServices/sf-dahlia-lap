import React from 'react'

import PageHeaderSimple from '../organisms/PageHeaderSimple'
import IndexTable from '../IndexTable'

const MarkedDuplicateIndexPageHeader = ({}) => {
  return (
    <div>
      <PageHeaderSimple title='Marked Duplicate Apps' />
    </div>
  )
}

const MarkedDuplicateIndexPageTable = ({ results, fields }) => {
  return (
    <div>
      <IndexTable
        results={results}
        fields={fields}
        links={['View Flagged Applications']} />
    </div>
  )
}

const MarkedDuplicateIndexPage = (props) => {
  return (
    <div>
      <MarkedDuplicateIndexPageHeader/>
      <MarkedDuplicateIndexPageTable {...props} />
    </div>
  )
}

export default MarkedDuplicateIndexPage
