import React from 'react'

const TableWrapper = ({ children }) => (
  <div className='form-grid row expand'>
    <div className='small-12 medium-12 large-12 column'>
      <div className='table-container-overflow-scroll'>
        {children}
      </div>
    </div>
  </div>
)

export default TableWrapper
