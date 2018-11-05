import React from 'react'

import reactFormUtils from '~/utils/reactFormUtils'

export const hasError = (formApi, field) => {
  var touched = reactFormUtils.get(formApi.touched, field)
  if (field === 'date_of_birth') { touched = (touched && touched.length === 3 && touched.every((t) => t === true)) }
  if (touched || formApi.submits > 0) { return !!formApi.getError(field) } else { return null }
}

export const FormError = ({ formApi, label, field, errorMessage }) => {
  if (hasError(formApi, field)) {
    const msg = formApi.getError(field)
    const fullMsg = errorMessage ? errorMessage(label, msg) : `${label} ${formApi.getError(field)}`
    return (
      <span className='small error'>
        {fullMsg}
      </span>)
  } else { return null }
}

export const errorClassName = (formApi, field) => {
  return { error: hasError(formApi, field) }
}
