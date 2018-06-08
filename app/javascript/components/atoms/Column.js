import React from 'react'

const Column = ({ children, span, end, form }) => (
  <div className={`columns small-${span} ${end ? 'end' :''} ${form ? 'form-grid_item' : ''}`}>
    {children}
  </div>
)

export default Column
