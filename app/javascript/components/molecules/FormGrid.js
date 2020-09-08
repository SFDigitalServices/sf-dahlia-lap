import React from 'react'

import classNames from 'classnames'

const FormGrid = {}

FormGrid.Row = ({ children, paddingBottom, expand }) => {
  const divClassNames = classNames(
    'form-grid',
    'row',
    {
      'expand': expand,
      // Override left and right margin if expand is false.
      // Otherwise default row styling causes negative margins.
      'margin-left-none': !expand,
      'margin-right-none': !expand,
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

// Wrapper for each form field.
// NOTE: Grid is hardcoded. This should not be generic element
FormGrid.Item = ({ children }) => (
  <div className='form-grid_item small-6 medium-6 large-6 column'>
    {children}
  </div>
)

// Use for form fields that have a shared label.
FormGrid.Group = ({ children, label }) => (
  <div className='form-group'>
    { label && <label htmlFor=''>{label}</label>}
    {children}
  </div>
)

export default FormGrid
