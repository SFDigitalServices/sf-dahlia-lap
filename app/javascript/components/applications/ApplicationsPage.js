import React from 'react'

import mapProps from 'utils/mapProps'

import { fetchApplications } from './applicationRequestUtils'
import ApplicationsTableContainer from './ApplicationsTableContainer'
import TableLayout from '../layouts/TableLayout'

const ApplicationsPage = (props) => {
  const pageHeader = {
    title: 'Applications'
  }

  return (
    <TableLayout pageHeader={pageHeader}>
      <ApplicationsTableContainer {...props} />
    </TableLayout>
  )
}

const mapProperties = ({ listings }) => {
  return {
    onFetchData: fetchApplications,
    listings
  }
}

export default mapProps(mapProperties)(ApplicationsPage)
