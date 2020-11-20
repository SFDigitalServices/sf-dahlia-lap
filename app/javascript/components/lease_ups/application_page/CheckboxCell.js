import React from 'react'

import { PropTypes } from 'prop-types'

import UnlabeledCheckbox from 'components/atoms/UnlabeledCheckbox'

const CheckboxCell = ({ applicationId, checked = false, onClick = () => {} }) => (
  <div className='form-group'>
    <UnlabeledCheckbox
      id={`bulk-action-checkbox-${applicationId}`}
      checked={checked}
      onClick={onClick}
    />
  </div>
)

CheckboxCell.propTypes = {
  applicationId: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onClick: PropTypes.func
}

export default CheckboxCell
