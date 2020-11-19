import React from 'react'

import { PropTypes } from 'prop-types'

const CheckboxCell = ({ applicationId, checked = false, onClick = () => {} }) => (
  <div className='form-group'>
    <input
      id={`bulk-action-checkbox-${applicationId}`}
      type='checkbox'
      checked={checked}
      onChange={onClick}
    />
    <label
      style={{ margin: '0px' }}
      className='form-label'
      htmlFor={`bulk-action-checkbox-${applicationId}`}
    />
  </div>
)

CheckboxCell.propTypes = {
  applicationId: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onClick: PropTypes.func
}

export default CheckboxCell
