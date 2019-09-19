import React from 'react'

import appPaths from '~/utils/appPaths'

import TableLayout from '../layouts/TableLayout'
import LeaseUpListingsTable from './LeaseUpListingsTable'

const LeaseUpListingsPage = ({listings}) => {
  const pageHeader = {
    title: 'Lease Ups'
  }

  const onCellClick = (rowInfo) => {
    window.location.href = appPaths.toLeaseUpApplications(rowInfo.original.id)
  }

  return (
    <TableLayout pageHeader={pageHeader} >
      <LeaseUpListingsTable
        listings={listings}
        onCellClick={onCellClick}
      />
    </TableLayout>
  )
}

export default LeaseUpListingsPage
