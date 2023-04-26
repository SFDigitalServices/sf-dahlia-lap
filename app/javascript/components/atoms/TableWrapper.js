import React from 'react'

import classNames from 'classnames'

const TableWrapper = ({ children, marginTop = false }) => {
  const topLevelClasses = classNames('form-grid', 'row expand', { 'margin-top--half': marginTop })

  return (
    <div className={topLevelClasses}>
      <div className='small-12 column'>
        <div className='table-container-overflow-scroll'>{children}</div>
      </div>
    </div>
  )
}

export default TableWrapper
