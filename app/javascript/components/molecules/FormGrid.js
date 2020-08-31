import React from 'react'

import classNames from 'classnames'

const FormGrid = {}

FormGrid.Row = ({ children, paddingBottom, expand }) => {
  const divClassNames = classNames(
    'form-grid',
    'row',
    {
      'expand': expand,
      'padding-bottom': paddingBottom
    }
  )
  return (
    <div className={divClassNames}>
      {children}
    </div>
  )
}

FormGrid.Row.defaultProps = {
  expand: true
}

// NOTE: Grid is hardcoded. This should not be generic element
FormGrid.Item = ({ children }) => (
  <div className='form-grid_item small-6 medium-6 large-6 column'>
    {children}
  </div>
)

FormGrid.Group = ({ children, label }) => (
  <div className='form-group'>
    { label && <label htmlFor=''>{label}</label>}
    {children}
  </div>
)

export default FormGrid
