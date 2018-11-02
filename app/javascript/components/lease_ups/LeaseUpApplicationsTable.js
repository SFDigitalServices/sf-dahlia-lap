import React from 'react'
import ReactTable from 'react-table'
import { trim } from 'lodash'

import StatusDropdown from '../molecules/StatusDropdown'
import { getLeaseUpStatusClass } from '~/utils/statusUtils'
import appPaths from '~/utils/appPaths'
import { cellFormat } from '~/utils/reactTableUtils'
import classNames from 'classnames'

const LeaseUpStatusCell = ({ cell, onChange }) => {
  const applicationPreferenceId = cell.original.id
  const applicationId = cell.original.application_id

  const value = cell.value || ''
  return (
    <StatusDropdown
      status={value}
      onChange={onChange.bind(null, applicationPreferenceId, applicationId)}
      styles={{position: 'absolute'}}
      buttonClasses={['tiny']} />
  )
}

const NoData = ({ children, className, ...rest }) => {
  return (
    <div className='rt-noData' {...rest}>
      <div style={{ textAlign: 'center', padding: '10px', marginBottom: '20px' }}>
        No results, try adjusting your filters
      </div>
      <div style={{ textAlign: 'center' }}>
        <button className='tertiary'>Reset all filters</button>
      </div>
    </div>
  )
}

const resizableCell = (cell) => (
  <span className='rt-resizable-td-content'>{cell.value}</span>
)

const isInvalid = (original) => {
  return original.post_lottery_validation === 'Invalid'
}

const PreferenceRankCell = ({cell}) => {
  if (isInvalid(cell.original)) {
    return (
      <div>
        <span className='rt-td-label-rank t-semis'>{cell.original.preference_rank}</span>
        <span className='rt-td-label-invalid t-semis'>Invalid</span>
      </div>
    )
  } else {
    return <div>{cell.original.preference_rank}</div>
  }
}

const LeaseUpApplicationsTable = ({ listingId, dataSet, onLeaseUpStatusChange, onCellClick, loading, onFetchData, pages, rowsPerPage }) => {
  const columns = [
    { Header: 'Preference Rank', accessor: 'rankOrder', headerClassName: 'td-min-narrow', Cell: cell => <PreferenceRankCell cell={cell} /> },
    { Header: 'Application Number', accessor: 'application_number', className: 'text-left', Cell: (cell) => (<a href={appPaths.toApplicationSupplementals(cell.original.application_id)} className='has-border'>{cell.value}</a>) },
    { Header: 'First Name', accessor: 'first_name', Cell: resizableCell, className: 'text-left' },
    { Header: 'Last Name', accessor: 'last_name', Cell: resizableCell, className: 'text-left' },
    { Header: 'Phone', accessor: 'phone', Cell: resizableCell, className: 'text-left' },
    { Header: 'Email', accessor: 'email', Cell: resizableCell, className: 'text-left' },
    { Header: 'Address', accessor: 'address', Cell: resizableCell, className: 'text-left' },
    { Header: 'Status Updated', accessor: 'status_last_updated', headerClassName: 'td-offset-right text-right', Cell: cellFormat.date },
    { Header: 'Lease Up Status', accessor: 'lease_up_status', headerClassName: 'td-min-wide tr-fixed-right', Cell: cell => <LeaseUpStatusCell cell={cell} onChange={onLeaseUpStatusChange} applicationId={cell.original.id} /> }
  ]

  const getTdProps = (state, rowInfo, column, instance) => {
    let attrs = {}

    // classes and onClick actions vary depending on the type of column
    if (column.id === 'lease_up_status') {
      attrs.className = 'td-min-wide td-status td-fixed-right'
    } else if (column.id !== 'application_number') {
      attrs.onClick = (e, handleOriginal) => { if (rowInfo) onCellClick(listingId, rowInfo) }

      if (column.id === 'status_last_updated') {
        attrs.className = 'td-offset-right text-right'
      } else if (column.id === 'rankOrder') {
        attrs.className = 'td-min-narrow'
      }
    }

    return attrs
  }

  const getTrProps = (state, rowInfo, column) => {
    const statusClassName = (rowInfo && !!trim(rowInfo.row.lease_up_status))
      ? getLeaseUpStatusClass(rowInfo.row.lease_up_status)
      : ''

    const trClassName = classNames(
      'rt-tr-status',
      statusClassName,
      { 'is-invalid': rowInfo && isInvalid(rowInfo.original) }
    )

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
      pages={pages}
      columns={columns}
      getTdProps={getTdProps}
      getTrProps={getTrProps}
      defaultPageSize={rowsPerPage}
      sortable={false}
      loading={loading}
      onFetchData={onFetchData}
      NoDataComponent={NoData}
      getPaginationProps={getPaginationProps}
    />
  )
}

export default LeaseUpApplicationsTable
