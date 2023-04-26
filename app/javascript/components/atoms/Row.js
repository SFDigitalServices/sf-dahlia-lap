import React from 'react'

const Row = ({ children, form }) => (
  <div className={`row ${form ? 'form-grid' : ''}`}>{children}</div>
)

export default Row
