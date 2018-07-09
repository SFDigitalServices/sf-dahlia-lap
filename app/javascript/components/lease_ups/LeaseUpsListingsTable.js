import React from 'react'
import ReactTable from 'react-table'
import { cellFormat } from '~/utils/reactTableUtils'

const PAGE_SIZE = 20

const LeaseUpsListingsTable = ({ listings, onCellClick }) => {
  const columns = [
    { Header: 'Listing Name', accessor: 'name', headerClassName: 'td-min-wide' },
    { Header: 'Lottery Date', accessor: 'lottery_date', Cell: cellFormat.date },
    { Header: 'Lottery Results Date', accessor: 'lottery_results_date', Cell: cellFormat.date },
    { Header: 'Applications in Lottery', accessor: 'in_lottery' },
    { Header: 'Total Units Available', accessor: 'units_available' },
    { Header: 'Leases Signed', accessor: 'lease_signed_application' },
    { Header: 'Last updated', accessor: 'last_modified_date', Cell: cellFormat.date }
  ]

  const getTdProps = (state, rowInfo, column, instance) => {
    let attributes = {
      onClick: (e, handleOriginal) => onCellClick(rowInfo)
    }

    if (column.id === 'name') {
      attributes.className = "td-bold td-min-wide"
    }

    return attributes
  }

  return (
    <ReactTable
      getTdProps={getTdProps}
      data={listings}
      columns={columns}
      showPagination={listings.length >= PAGE_SIZE}
    />
  )
}

export default LeaseUpsListingsTable
