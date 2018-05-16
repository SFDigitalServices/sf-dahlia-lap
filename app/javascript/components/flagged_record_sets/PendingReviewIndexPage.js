import React from 'react'

import PageHeaderSimple from '../organisms/PageHeaderSimple'
import IndexTable from '../IndexTable'

const PendingReviewIndexPageHeader = ({}) => {
  return (
    <div>
      <PageHeaderSimple title='Flagged Applications - Pending Review' />
    </div>
  )
}

const PendingReviewIndexPageTable = ({ results, fields }) => {
  return (
    <div>
      <IndexTable
        results={results}
        fields={fields}
        links={['View Flagged Applications']} />
    </div>
  )
}

const PendingReviewIndexPage = (props) => {
  return (
    <div>
      <PendingReviewIndexPageHeader {...props}/>
      <PendingReviewIndexPageTable {...props} />
    </div>
  )
}

export default PendingReviewIndexPage
