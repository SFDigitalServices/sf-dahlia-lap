import React from 'react'

import PageHeaderSimple from '../../organisms/PageHeaderSimple'
import IndexTable from '../../IndexTable'

const FlaggedApplicationsIndexPageHeader = ({ title }) => {
  return (
    <div>
      <PageHeaderSimple title={title} />
    </div>
  )
}

const FlaggedApplicationsIndexPageTable = ({ results, fields }) => {
  return (
    <div>
      <IndexTable
        results={results}
        fields={fields}
        links={['View Flagged Applications']} />
    </div>
  )
}

const FlaggedApplicationsIndexPage = (props) => {
  return (
    <div>
      <FlaggedApplicationsIndexPageHeader {...props} />
      <FlaggedApplicationsIndexPageTable {...props} />
    </div>
  )
}

export default FlaggedApplicationsIndexPage
