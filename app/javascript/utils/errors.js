import React from 'react'
import classNames from 'classnames'

export const hasError = (formApi, field) => {
  if (formApi.getTouched(field) || formApi.submits > 0)
    return !!formApi.getError(field)
  else
    return null
}

export const FormError = ({ formApi, field }) => {
  if (hasError(formApi, field))
    return <span className="small error">{formApi.getError(field)}</span>
  else
    return null
}

export const errorClassName = (formApi, field) => {
  return { error: hasError(formApi, field) }
}

const BlockNote = ({ value }) => (
  <span className="checkbox-block_note no-margin">{value}</span>
)

export const Field = ({ formApi, field, label, blockNote, children }) => {
  console.log(field)
  console.log(formApi.getTouched(field))
  console.log(formApi.getError(field))
  console.log(formApi.submits)
  const className = errorClassName(formApi, field)
  console.log(className)
  return (
    <div className={classNames('form-group', className)}>
      <label className='form-label'>
        {label}
        {blockNote && <BlockNote value={blockNote} />}
      </label>
      { children(field, classNames(className)) }
      <FormError formApi={formApi} field={field}/>
    </div>
  )
}
