import React from 'react'
import ReactTable from 'react-table'
import { cellFormat } from '~/utils/reactTableUtils'

const LeaseUpsListingsTable = ({ listings, onCellClick }) => {
  const columns = [
    { Header: 'Listing Name', accessor: 'name' },
    { Header: 'Lottery Date', accessor: 'lottery_date', Cell: cellFormat.date },
    { Header: 'Lottery Results Date', accessor: 'lottery_results_date', Cell: cellFormat.date },
    { Header: 'Applications in Lottery', accessor: 'in_lottery' },
    { Header: 'Total Units Available', accessor: 'units_available' },
    { Header: 'Leases Signed', accessor: 'lease_signed_application' },
    { Header: 'Last updated', accessor: 'last_modified_date', Cell: cellFormat.date }
  ]

  const getTdProps = (state, rowInfo, column, instance) => {
    return {
      onClick: (e, handleOriginal) => onCellClick(rowInfo)
    }
  }

  return (
    <ReactTable
      getTdProps={getTdProps}
      className="rt-table-status"
      data={listings}
      columns={columns}
    />
  )
}

export default LeaseUpsListingsTable
