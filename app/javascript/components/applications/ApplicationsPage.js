import React from 'react'

import { map } from 'lodash'
import mapProps from '~/utils/mapProps'
import TableLayout from '../layouts/TableLayout'
import ApplicationsTableContainer from './ApplicationsTableContainer'
// import mapProperties from './applicationsPageMapper'
import { fetchApplications } from './actions'
import { mapListing } from '~/components/mappers/soqlToDomain'

const ApplicationsPage = (props) => {
  const pageHeader = {
    title: 'Applications'
  }

  return (
    <TableLayout pageHeader={pageHeader} >
      <ApplicationsTableContainer {...props} />
    </TableLayout>
  )
}

const mapProperties = ({ listings }) => {
  return {
    onFetchData: fetchApplications,
    listings: map(listings, mapListing)
  }
}

export default mapProps(mapProperties)(ApplicationsPage)
