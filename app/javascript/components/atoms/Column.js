import React from 'react'

const Column = ({ children, span, end }) => (
  <div className={`columns small-${span} ${end ? 'end' :''}`}>
    {children}
  </div>
)

export default Column
