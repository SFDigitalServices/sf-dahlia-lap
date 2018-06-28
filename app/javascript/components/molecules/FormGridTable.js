import React from 'react'
import ExpandableTableWrapper from '../pattern_library_wrappers/ExpandableTableWrapper'

const FormGridTable = ({ columns, rows }) => {
  return (
    <div className="form-grid row expand">
      <div className="small-12 column">
        <div className="scrollable-table-container">
          <ExpandableTableWrapper columns={columns} rows={rows} />
        </div>
      </div>
    </div>
  )
}

export default FormGridTable
