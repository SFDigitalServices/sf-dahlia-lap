import React from 'react'

import { PropTypes } from 'prop-types'

const UnlabeledCheckbox = ({ id, checked = false, onClick = () => {} }) => (
  <>
    <input id={id} type='checkbox' checked={checked} onChange={onClick} />
    <label style={{ margin: '0px' }} className='form-label' htmlFor={id} />
  </>
)

UnlabeledCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onClick: PropTypes.func
}
export default UnlabeledCheckbox
