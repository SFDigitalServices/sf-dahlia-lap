import React from 'react'

import classNames from 'classnames'

const FormGrid = {}

FormGrid.Row = ({children, paddingBottom}) => {
  const divClassNames = classNames(
    'form-gird',
    'row',
    'expand',
    {
      'padding-bottom': paddingBottom
    }
  )
  return (
    <div className={divClassNames}>
      {children}
    </div>
  )
}

// NOTE: Grid is hardcoded. This should not be generic element
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
