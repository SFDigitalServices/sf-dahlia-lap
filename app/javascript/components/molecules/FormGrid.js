import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

const FormGrid = {}

FormGrid.Row = ({ children, paddingBottom, expand }) => {
  const divClassNames = classNames('form-grid', 'row', {
    expand: expand,
    // Override left and right margin if expand is false.
    // Otherwise default row styling causes negative margins.
    'margin-left-none': !expand,
    'margin-right-none': !expand,
    'padding-bottom': paddingBottom
  })
  return <div className={divClassNames}>{children}</div>
}

FormGrid.Row.defaultProps = {
  expand: true
}

// Wrapper for each form field.
// NOTE: Grid is hardcoded. This should not be generic element
FormGrid.Item = ({ children = null, width = '50%' }) => {
  let widthStyle

  switch (width) {
    case '25%':
      widthStyle = 'small-3'
      break
    case '33%':
      widthStyle = 'small-4'
      break
    case '50%':
      widthStyle = 'small-6'
      break
    case '100%':
      widthStyle = 'small-12'
      break
  }

  return <div className={classNames('form-grid_item column', widthStyle)}>{children}</div>
}

FormGrid.Item.propTypes = {
  children: PropTypes.node,
  width: PropTypes.oneOf(['25%', '33%', '50%', '100%'])
}

// Use for form fields that have a shared label.
FormGrid.Group = ({ children, label }) => (
  <div className='form-group'>
    {label && <label htmlFor=''>{label}</label>}
    {children}
  </div>
)

export default FormGrid
