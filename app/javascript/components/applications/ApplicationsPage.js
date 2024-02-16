import React from 'react'

import ErrorBoundary from 'components/atoms/ErrorBoundary'
import mapProps from 'utils/mapProps'

import { fetchApplications } from './applicationRequestUtils'
import ApplicationsTableContainer from './ApplicationsTableContainer'
import TableLayout from '../layouts/TableLayout'

const ApplicationsPage = (props) => {
  const pageHeader = {
    title: 'Applications'
  }

  return (
    <ErrorBoundary>
      <TableLayout pageHeader={pageHeader}>
        <ApplicationsTableContainer {...props} />
      </TableLayout>
    </ErrorBoundary>
  )
}

const mapProperties = ({ listings }) => {
  return {
    onFetchData: fetchApplications,
    listings
  }
}

export default mapProps(mapProperties)(ApplicationsPage)
