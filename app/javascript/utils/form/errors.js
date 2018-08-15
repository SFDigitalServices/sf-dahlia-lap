import React from 'react'

export const hasError = (formApi, field) => {
  if (formApi.getTouched(field) || formApi.submits > 0)
    return !!formApi.getError(field)
  else
    return null
}

export const FormError = ({ formApi, label, field, errorMessage }) => {
  if (hasError(formApi, field)) {
    const msg = formApi.getError(field)
    const fullMsg = errorMessage ? errorMessage(label, msg) : `${label} ${formApi.getError(field)}`
    return (
      <span className="small error">
        {fullMsg}
      </span>)
  } else
    return null
}

export const errorClassName = (formApi, field) => {
  return { error: hasError(formApi, field) }
}
