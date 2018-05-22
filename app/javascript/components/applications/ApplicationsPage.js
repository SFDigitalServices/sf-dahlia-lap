import React from 'react'

import PageHeaderSimple from '../organisms/PageHeaderSimple'
import IndexTable from '../IndexTable'

const ApplicationsPageHeader = ({}) => {
  return (
    <div>
      <PageHeaderSimple title='Applications' />
    </div>
  )
}

const ApplicationsPageTable = ({ applications, fields }) => {
  return (
    <IndexTable
      results={applications}
      fields= {fields}
      links={['View Application'] } />
  )
}

const ApplicationsPage = (props) => {
  return (
    <div>
      <ApplicationsPageHeader/>
      <ApplicationsPageTable {...props} />
    </div>
  )
}

export default ApplicationsPage
