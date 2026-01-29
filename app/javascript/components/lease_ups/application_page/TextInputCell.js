import React from 'react'

import { PropTypes } from 'prop-types'

import { InputField } from 'utils/form/final_form/Field'

const TextInputCell = ({ applicationId, validation = () => {} }) => {
  const uniqueId = `bulk-rsvp-text-input-${applicationId}`
  return (
    <InputField
      fieldName={uniqueId}
      id={uniqueId}
      cols='30'
      rows='10'
      ariaDescribedby='invite-to-apply-upload-url-label'
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
