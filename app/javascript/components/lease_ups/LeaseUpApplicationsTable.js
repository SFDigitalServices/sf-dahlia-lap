import React, { useEffect, useState } from 'react'

import classNames from 'classnames'
import { trim } from 'lodash'
import { Link } from 'react-router-dom'
import ReactTable from 'react-table'

import CheckboxCell from 'components/lease_ups/application_page/CheckboxCell'
import PreferenceRankCell from 'components/lease_ups/application_page/PreferenceRankCell'
import appPaths from 'utils/appPaths'
import { MAX_SERVER_LIMIT } from 'utils/EagerPagination'
import { cellFormat } from 'utils/reactTableUtils'
import { getLeaseUpStatusClass } from 'utils/statusUtils'

import StatusDropdown from '../molecules/StatusDropdown'
import StatusHistoryPopover from '../organisms/StatusHistoryPopover'

const LeaseUpStatusCell = ({ cell, onChange }) => {
  const applicationId = cell.original.application_id

  const value = cell.value || null
  return (
    <div style={{ display: 'flex', position: 'absolute', alignItems: 'center' }}>
      <StatusDropdown status={value} size='tiny' onChange={(val) => onChange(val, applicationId)} />
      <StatusHistoryPopover applicationId={applicationId} />
    </div>
  )
}

const resizableCell = (cell) => <span className='rt-resizable-td-content'>{cell.value}</span>

const LeaseUpApplicationsTable = ({
  listingId,
  dataSet,
  onLeaseUpStatusChange,
  onCellClick,
  loading,
  onFetchData,
  pages,
  rowsPerPage,
  atMaxPages,
  bulkCheckboxesState,
  onBulkCheckboxClick
}) => {
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    setCurrentPage(0)
  }, [pages])

  const maxPagesMsg = `Unfortunately, we can only display the first ${
    MAX_SERVER_LIMIT / rowsPerPage
  } pages of applications at this time. Please use the filters above to narrow your results.`
  const noDataMsg = atMaxPages ? maxPagesMsg : 'No results, try adjusting your filters'
  const columns = [
    {
      Header: '',
      accessor: 'bulk_checkbox',
      headerClassName: 'td-min-narrow',
      className: 'td-min-narrow',
      Cell: (cell) => {
        const appId = cell.original.application_id
        return (
          <CheckboxCell
            checked={bulkCheckboxesState[appId]}
            applicationId={appId}
            onClick={() => onBulkCheckboxClick(appId)}
          />
        )
      }
    },
    {
      Header: 'Preference Rank',
      accessor: 'rankOrder',
      headerClassName: 'td-min-narrow',
      className: 'td-min-narrow',
      Cell: (cell) => (
        <PreferenceRankCell
          preferenceRank={cell.original.preference_rank}
          preferenceValidation={cell.original.post_lottery_validation}
        />
      )
    },
    {
      Header: 'Application Number',
      accessor: 'application_number',
      className: 'text-left',
      Cell: (cell) => (
        <Link
          to={appPaths.toApplicationSupplementals(cell.original.application_id)}
          className='has-border'
        >
          {cell.value}
        </Link>
      )
    },
    { Header: 'First Name', accessor: 'first_name', Cell: resizableCell, className: 'text-left' },
    { Header: 'Last Name', accessor: 'last_name', Cell: resizableCell, className: 'text-left' },
    {
      Header: 'Accessibility Requests',
      accessor: 'accessibility',
      Cell: resizableCell,
      className: 'text-left'
    },
    {
      Header: 'HH',
      accessor: 'total_household_size',
      Cell: resizableCell,
      headerClassName: 'text-right td-min-narrow',
      className: 'text-right td-min-narrow'
    },
    {
      Header: 'Updated',
      accessor: 'status_last_updated',
      headerClassName: 'text-right td-min-narrow',
      className: 'text-right td-min-narrow',
      Cell: cellFormat.date
    },
    {
      Header: 'Substatus',
      accessor: 'sub_status',
      headerClassName: 'td-offset-right',
      className: 'td-offset-right text-right td-min-wide'
    },
    {
      Header: 'Lease Up Status',
      accessor: 'lease_up_status',
      headerClassName: 'td-min-wide tr-fixed-right',
      className: 'td-min-wide td-status td-fixed-right',
      Cell: (cell) => <LeaseUpStatusCell cell={cell} onChange={onLeaseUpStatusChange} />
    }
  ]

  const getTdProps = (state, rowInfo, column) => {
    const attrs = {}

    // onClick actions vary depending on the type of column
    if (
      column.id !== 'application_number' &&
      column.id !== 'lease_up_status' &&
      column.id !== 'bulk_checkbox'
    ) {
      attrs.onClick = (e, handleOriginal) => {
        if (rowInfo) onCellClick(listingId, rowInfo)
      }
    }

    return attrs
  }

  const getTrProps = (state, rowInfo, column) => {
    const statusClassName =
      rowInfo && !!trim(rowInfo.row.lease_up_status)
        ? getLeaseUpStatusClass(rowInfo.row.lease_up_status)
        : ''

    const trClassName = classNames('rt-tr-status', statusClassName)

    return {
      className: trClassName,
      tabIndex: '0'
    }
  }

  // Selecting the size of pages does not work with manual override.
  const getPaginationProps = () => {
    return {
      showPageSizeOptions: false
    }
  }

  return (
    <ReactTable
      manual
      className='rt-table-status'
      data={dataSet}
      page={currentPage}
      pages={pages}
      columns={columns}
      getTdProps={getTdProps}
      getTrProps={getTrProps}
      defaultPageSize={rowsPerPage}
      sortable={false}
      loading={loading}
      onFetchData={(state, instance) => {
        setCurrentPage(state.page)
        onFetchData(state, instance)
      }}
      noDataText={noDataMsg}
      getPaginationProps={getPaginationProps}
    />
  )
}

export default LeaseUpApplicationsTable
