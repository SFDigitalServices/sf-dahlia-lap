import React from 'react'

import { PropTypes } from 'prop-types'

import { InputField } from 'utils/form/final_form/Field'

const TextInputCell = ({ id, validation = () => {} }) => {
  return (
    <InputField
      fieldName={id}
      id={id}
      label={true}
      cols='30'
      rows='10'
      ariaDescribedby={id + '-label'}
      maxLength='255'
      validation={validation}
    />
  )
}

TextInputCell.propTypes = {
  applicationId: PropTypes.string.isRequired,
  validation: PropTypes.func
}

export default TextInputCell
