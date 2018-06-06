import React from 'react'
import ReactTable from 'react-table'
import { trim } from 'lodash'

import Dropdown from '../molecules/Dropdown'
import PrettyTime from '../atoms/PrettyTime'
import utils from '~/utils/utils'
import appPaths from '~/utils/appPaths'

import { LEASE_UP_STATUS_OPTIONS, PAGE_SIZE, getLeaseUpStatusStyle } from './leaseUpsHelpers'

const LeaseUpStatusCell = ({ cell, onChange, applicationId }) => {
  const value = cell.value || ''
  return (
    <Dropdown
      items={LEASE_UP_STATUS_OPTIONS}
      value={value}
      prompt='Status'
      onChange={onChange.bind(null, applicationId)}
      styles={{position: 'absolute'}}
      buttonClasses={[getLeaseUpStatusStyle(value), 'tiny']} />
  )
}

const NoData = ({ children, className, ...rest }) => {
  return (
    <div className='rt-noData' {...rest}>
      <div style={{ textAlign:'center', padding:'10px', marginBottom: '20px' }}>
        No results, try adjusting your filters
      </div>
      <div style={{ textAlign:'center'}}>
        <button className='tertiary'>Reset all filters</button>
      </div>
    </div>
  )
}

const LeaseUpsTable = ({ listingId, dataSet, onLeaseUpStatusChange, onCellClick }) => {
  const columns = [
      { Header: 'Preference Rank',    accessor: 'rankOrder',          headerClassName: 'td-min-narrow', Cell: (cell) => ( <div>{cell.original.preference_rank}</div>) },
      { Header: 'Application Number', accessor: 'application_number', Cell: (cell) => ( <a href={appPaths.toApplicationSupplementals(cell.original.id)} className="has-border">{cell.value}</a>) },
      { Header: 'First Name',         accessor: 'first_name' ,        Cell: (cell) => ( <span className="rt-resizable-td-content">{cell.value}</span> ) },
      { Header: 'Last Name',          accessor: 'last_name' ,         Cell: (cell) => ( <span className="rt-resizable-td-content">{cell.value}</span> ) },
      { Header: 'Phone',              accessor: 'phone' ,             Cell: (cell) => ( <span className="rt-resizable-td-content">{cell.value}</span> ) },
      { Header: 'Email',              accessor: 'email' ,             Cell: (cell) => ( <span className="rt-resizable-td-content">{cell.value}</span> ) },
      { Header: 'Address',            accessor: 'address',            Cell: (cell) => ( <span className="rt-resizable-td-content">{cell.value}</span> ) },
      { Header: 'Status Updated',     accessor: 'status_updated' ,    headerClassName: 'td-offset-right', Cell: (cell) => ( cell.value ? <PrettyTime time={cell.value} parseFormat={utils.SALESFORCE_DATE_FORMAT} /> : <i>none</i> ) },
      { Header: 'Lease Up Status',    accessor: 'lease_up_status',    headerClassName: 'td-min-wide tr-fixed-right', Cell: (cell) => ( <LeaseUpStatusCell cell={cell} onChange={onLeaseUpStatusChange} applicationId={cell.original.id}/> ) }
    ]

  const getTdProps = (state, rowInfo, column, instance) => {
    let attrs = {}

    // classes and onClick actions vary depending on the type of column
    if (column.id === 'lease_up_status') {
      attrs.className = 'td-min-wide td-status td-fixed-right'
    } else if (column.id !== 'application_number') {
      attrs.onClick = (e, handleOriginal) => { if (rowInfo) onCellClick(listingId, rowInfo) }

      if (column.id === 'status_updated') {
        attrs.className = 'td-offset-right'
      } else if (column.id === 'preference_rank') {
        attrs.className = 'td-min-narrow'
      }
    }

    return attrs
  }

  const getTrProps = (state, rowInfo, column) => {
    const statusClassName = (rowInfo && !!trim(rowInfo.row.lease_up_status))
                            ? getLeaseUpStatusStyle(rowInfo.row.lease_up_status)
                            : ''

    return {
      className: `rt-tr-status ${statusClassName}`,
      tabIndex: "0"
    }
  }

  const sortBy = [ { id:'rankOrder', desc:false } ]

  return (
    <ReactTable
      className="rt-table-status"
      data={dataSet}
      columns={columns}
      getTdProps={getTdProps}
      getTrProps={getTrProps}
      defaultSorted={sortBy}
      defaultPageSize={PAGE_SIZE}
      NoDataComponent={NoData} />
  )
}


export default LeaseUpsTable
