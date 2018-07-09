import React from 'react'
import { map } from 'lodash'

import mapProps from '~/utils/mapProps'
import { mapListing } from '~/components/mappers/soqlToDomain'
import appPaths from '~/utils/appPaths'

import TableLayout from '../layouts/TableLayout'
import LeaseUpsListingsTable from './LeaseUpsListingsTable'

const LeaseUpsListingsPage = ({listings}) => {
  const pageHeader = {
    title: 'Lease Ups'
  }

  const onCellClick = (rowInfo) => {
    window.location.href = appPaths.toLeaseUpApplications(rowInfo.original.id)
  }

  return (
    <TableLayout pageHeader={pageHeader} >
      <LeaseUpsListingsTable
        listings={listings}
        onCellClick={onCellClick}
      />
    </TableLayout>
  )
}

const mapProperties = ({listings}) => {
  return {
    listings: map(listings, mapListing)
  }
}

export default mapProps(mapProperties)(LeaseUpsListingsPage)
