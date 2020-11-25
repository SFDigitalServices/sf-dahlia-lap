import React from 'react'

import { PropTypes } from 'prop-types'

import Checkbox from 'components/atoms/Checkbox'

const CheckboxCell = ({ applicationId, checked = false, onClick = () => {} }) => (
  <div className='form-group'>
    <Checkbox id={`bulk-action-checkbox-${applicationId}`} checked={checked} onClick={onClick} />
  </div>
)

CheckboxCell.propTypes = {
  applicationId: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onClick: PropTypes.func
}

export default CheckboxCell
