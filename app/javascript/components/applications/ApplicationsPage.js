import React from 'react'

import mapProps from '~/utils/mapProps'
import TableLayout from '../layouts/TableLayout'
import ApplicationsTable from './ApplicationsTable'
import ApplicationsTableContainer from './ApplicationsTableContainer'
import mapProperties from './mapProperties'

// We cannot re use this mappers, since the shape pass as json to the Page component are different
// we should normalize our domain object to be re usable.
// import { mapApplication, mapListing } from '~/components/propMappers'

// const ApplicationsPageTable = ({ applications, fields }) => {
//   return (
//     <IndexTable
//       results={applications}
//       fields= {fields}
//       links={['View Application'] } />
//   )
// }

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
// export default ApplicationsPage
