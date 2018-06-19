import React from 'react'

const FormGrid = {}

FormGrid.Row = ({children}) => (
  <div className="form-grid row expand padding-bottom">
    {children}
  </div>
)

FormGrid.Item = ({children}) => (
  <div className="form-grid_item small-12 medium-6 large-3 column">
    {children}
  </div>
)

FormGrid.Group = ({children, label}) => (
  <div className="form-group">
    { label && <label htmlFor="">{label}</label>}
    {children}
  </div>
)

export default FormGrid
