import React from 'react'

import mapProps from 'utils/mapProps'

import TableLayout from '../layouts/TableLayout'
import { fetchApplications } from './actions'
import ApplicationsTableContainer from './ApplicationsTableContainer'

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
