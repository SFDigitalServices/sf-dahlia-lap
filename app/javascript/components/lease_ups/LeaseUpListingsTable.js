import React from 'react'
import ReactTable from 'react-table'
import { cellFormat } from 'utils/reactTableUtils'

const PAGE_SIZE = 20

const LeaseUpListingsTable = ({ listings, onCellClick }) => {
  const columns = [
    { Header: 'Listing Name', accessor: 'name', headerClassName: 'td-min-wide' },
    {
      Header: 'Lottery Date',
      accessor: 'lottery_date',
      Cell: cellFormat.date,
      headerClassName: 'text-right',
      className: 'text-right'
    },
    {
      Header: 'Lottery Results Date',
      accessor: 'lottery_results_date',
      Cell: cellFormat.date,
      minWidth: 120,
      headerClassName: 'text-right',
      className: 'text-right'
    },
    {
      Header: 'Applications in Lottery',
      accessor: 'in_lottery',
      headerClassName: 'text-right',
      className: 'text-right'
    },
    {
      Header: 'Total Units Available',
      accessor: 'units_available',
      headerClassName: 'text-right',
      className: 'text-right'
    },
    {
      Header: 'Leases Signed',
      accessor: 'lease_signed_application',
      headerClassName: 'text-right',
      className: 'text-right'
    },
    {
      Header: 'Last updated',
      accessor: 'last_modified_date',
      Cell: cellFormat.date,
      headerClassName: 'text-right',
      className: 'text-right'
    }
  ]

  const getTdProps = (state, rowInfo, column, instance) => {
    const attributes = {
      onClick: (e, handleOriginal) => onCellClick(rowInfo)
    }

    if (column.id === 'name') {
      attributes.className = 'td-bold td-min-wide'
    }

    return attributes
  }

  return (
    <ReactTable
      getTdProps={getTdProps}
      data={listings}
      columns={columns}
      defaultPageSize={PAGE_SIZE}
      showPagination={listings.length >= PAGE_SIZE}
    />
  )
}

export default LeaseUpListingsTable
