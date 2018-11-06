import React from 'react'

const ExpandablePanel = ({ children }) => {
  return (
    <div className='app-editable expand-wide scrollable-table-nested'>
      {children}
    </div>
  )
}

export default ExpandablePanel
