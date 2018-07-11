import React from 'react'

import mapProps from '~/utils/mapProps'
import TableLayout from '../layouts/TableLayout'
import ApplicationsTableContainer from './ApplicationsTableContainer'
import mapProperties from './applicationsPageMapper'

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

export default mapProps(mapProperties)(ApplicationsPage)
