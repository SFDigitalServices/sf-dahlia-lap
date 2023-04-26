import React, { useState } from 'react'

import ExpandableTable from 'components/molecules/ExpandableTable'

const ExpandableTableWrapper = ({ columns, rows }) => {
  const [expandedRows, setExpandedRows] = useState(new Set())

  const closeRow = (index) => {
    const newExpandedRows = new Set(expandedRows)
    newExpandedRows.delete(index)
    setExpandedRows(newExpandedRows)
  }

  const openRow = (index) => setExpandedRows(new Set([...expandedRows, index]))

  return (
    <ExpandableTable
      columns={columns}
      rows={rows}
      expandedRowIndices={expandedRows}
      renderExpanderButton={(index, row, original, expanded) => (
        <button
          className='button button-link action-link'
          onClick={(e) => (expanded ? closeRow(index) : openRow(index))}
        >
          {expanded ? 'Close' : 'Expand'}
        </button>
      )}
      renderRow={(index, row) => (
        <div className='inline-modal'>
          <div>Hello</div>
          <br />
          <button className='button' onClick={(e) => closeRow(index)}>
            Close
          </button>
        </div>
      )}
    />
  )
}

export default ExpandableTableWrapper
