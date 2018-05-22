import React from 'react'
import ReactTable from 'react-table'
import _ from 'lodash'

import DropdownMenuItem  from '../atoms/DropdownMenuItem'
import Dropdown from '../molecules/Dropdown'
import PrettyTime from '../utils/PrettyTime'

import { LEASE_UP_STATUS_OPTIONS, PAGE_SIZE } from './data'

const LeaseUpStatusCell = ({ cell, onChange }) => {
  const value = cell.value || ''
  return (
    <Dropdown items={LEASE_UP_STATUS_OPTIONS} value={value} prompt="Status"/>
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
      { Header: 'Preference Rank',    accessor: 'preference_rank',    headerClassName: 'td-min-narrow', Cell: (cell) => ( <div>{cell.value}</div>) },
      { Header: 'Application Number', accessor: 'application_number', Cell: (cell) => ( <a href={`/applications/${cell.original.id}`} className="has-border">{cell.value}</a>) },
      { Header: 'First Name',         accessor: 'first_name' ,        Cell: (cell) => ( <span className="rt-resizable-td-content">{cell.value}</span> ) },
      { Header: 'Last Name',          accessor: 'last_name' ,         Cell: (cell) => ( <span className="rt-resizable-td-content">{cell.value}</span> ) },
      { Header: 'Phone',              accessor: 'phone' ,             Cell: (cell) => ( <span className="rt-resizable-td-content">{cell.value}</span> ) },
      { Header: 'Email',              accessor: 'email' ,             Cell: (cell) => ( <span className="rt-resizable-td-content">{cell.value}</span> ) },
      { Header: 'Address',            accessor: 'address',            Cell: (cell) => ( <span className="rt-resizable-td-content">{cell.value}</span> ) },
      { Header: 'Status Updated',     accessor: 'status_updated' ,    headerClassName: 'td-offset-right', Cell: (cell) => ( <PrettyTime time={cell.value} /> ) },
      { Header: 'Lease Up status',    accessor: 'lease_up_status',    headerClassName: 'td-min-wide tr-fixed-right', Cell: (cell) => ( <LeaseUpStatusCell cell={cell} onChange={onLeaseUpStatusChange} /> ) }
    ]

  const getTdProps = (state, rowInfo, column, instance) => {
    let attrs = {}
    if (column.id == 'lease_up_status') { // We do not want the Select to react onClick
      attrs.className = 'td-min-wide td-status td-fixed-right'
      return attrs
    } else if (column.id == 'application_number') {
      return attrs
    } else {
      attrs.onClick = (e, handleOriginal) => {
          if (rowInfo)
            onCellClick(listingId, rowInfo)
      }

      if (column.id == 'status_updated') {
        attrs.className = 'td-offset-right'
      }

      else if (column.id == 'preference_rank') {
        attrs.className = 'td-min-narrow'
      }
    }

    return attrs
  }

  const getTrProps = (state, rowInfo, column) => {
    const statusClassName = (rowInfo && !!_.trim(rowInfo.row.lease_up_status))
                            ? `is-${_.lowerCase(rowInfo.row.lease_up_status)}`
                            : ''

    return {
      className: `rt-tr-status ${statusClassName}`,
      tabIndex: "0"
    }
  }

  const sortBy = [ { id:'rankOrder', desc:false } ]

  return (
    <ReactTable className="rt-table-status"
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
