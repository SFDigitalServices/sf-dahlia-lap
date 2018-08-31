import React from 'react'

const TableWrapper = ({ children }) => (
  <div className="form-grid row expand">
    <div className="small-12 column">
      <div className="scrollable-table-container-under-xlarge">
        {children}
      </div>
    </div>
  </div>
)

export default TableWrapper
