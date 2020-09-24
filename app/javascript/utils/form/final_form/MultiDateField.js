import React from 'react'
import { maxLengthMap } from '~/utils/formUtils'
import { Field } from 'react-final-form'
import { Input, BlockNote } from '~/utils/form/final_form/Field'
import { every, last } from 'lodash'
import classNames from 'classnames'

const InputField = ({ type, fieldName, validation, placeholder, maxLength, id, disabled }) => (
  <Field name={fieldName} validate={validation}>
    {({ input, meta }) => (
      <>
        <Input
          input={input}
          type={type}
          meta={meta}
          id={id || `form-${fieldName}`}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
        />
      </>
    )}
  </Field>
)

export const MultiDateField = ({
  form,
  fieldName,
  formName,
  index,
  label,
  blockNote,
  id,
  disabled
}) => {
  const touched = every(['.day', '.month', '.year'], (type) => {
    return form.getState().touched[fieldName + type]
  })
  let errorField
  if (formName) {
    errorField = form.getState().errors[formName] ? form.getState().errors[formName][index] : null
  } else {
    errorField = form.getState().errors[fieldName.split('.')[0]]
  }
  const baseFieldName = last(fieldName.split('.'))
  const error =
    form && touched && errorField && errorField[baseFieldName] && errorField[baseFieldName].all
  return (
    <div className={classNames('form-group', (error && 'error') || '')}>
      <label className='form-label' htmlFor={id || `form-${fieldName}`}>
        {label}
        {blockNote && <BlockNote value={blockNote} />}
      </label>
      <div className='form-group-month'>
        <InputField
          type='text'
          fieldName={`${fieldName}.month`}
          id={id ? `${id}_month` : `form-${fieldName}_month`}
          placeholder='MM'
          pattern='\d*'
          maxLength={maxLengthMap.month}
          disabled={disabled}
        />
      </div>
      <div className='form-group-day'>
        <InputField
          type='text'
          fieldName={`${fieldName}.day`}
          id={id ? `${id}_day` : `form-${fieldName}_day`}
          placeholder='DD'
          pattern='\d*'
          maxLength={maxLengthMap.day}
          disabled={disabled}
        />
      </div>
      <div className='form-group-year'>
        <InputField
          type='text'
          fieldName={`${fieldName}.year`}
          id={id ? `${id}_year` : `form-${fieldName}_year`}
          placeholder='YYYY'
          pattern='\d*'
          maxLength={maxLengthMap.year}
          disabled={disabled}
        />
      </div>
      <div className='d-inline-block'>{error && <span className='small error'>{error}</span>}</div>
    </div>
  )
}
