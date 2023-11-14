import React from 'react'

import classNames from 'classnames'
import { PropTypes } from 'prop-types'

const Checkbox = ({ id, checked = false, indeterminate = false, onClick = () => {} }) => (
  <>
    <input
      id={id}
      type='checkbox'
      checked={indeterminate || checked}
      onClick={onClick}
      // onChange handler required because we're setting 'checked' prop,
      // but we actually want our handler to be onClick instead,
      // so this is a no-op function.
      onChange={() => {}}
      className={classNames('no-margin', { indeterminate: indeterminate })}
    />
    <label
      style={{ margin: '0px' }}
      className='form-label'
      htmlFor={id}
      data-testid='checkbox-label'
    />
  </>
)

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  onClick: PropTypes.func
}
export default Checkbox
