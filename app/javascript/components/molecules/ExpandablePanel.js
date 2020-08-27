import React from 'react'

const ExpandablePanel = ({ children }) => {
  return (
    <div className='app-editable padding-left--2x padding-right--2x scrollable-table-nested'>
      {children}
    </div>
  )
}

export default ExpandablePanel
