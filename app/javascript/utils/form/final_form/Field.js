import React from 'react'
import { Field } from 'react-final-form'
import formOptions from '~/components/applications/application_form/formOptions'
import classNames from 'classnames'

const {
  labelize
} = formOptions

export const BlockNote = ({ value }) => (
  <span className='checkbox-block_note no-margin'>{value}</span>
)

export const FieldWrapper = ({ type, fieldName, label, blockNote, validation, placeholder, maxLength, id }) => (
  <Field name={fieldName} validate={validation}>
    {({ input, meta }) => (
      <React.Fragment>
        <div className={classNames((label && 'form-group'), (meta.error && meta.touched && 'error') || '')} >
          {label && <label htmlFor={id || `form-${fieldName}`} className='form-label'>
            {label && `${label} `}
            {blockNote && <BlockNote value={blockNote} />}
          </label>}
          <input {...input}
            id={id || `form-${fieldName}`}
            className={(meta.error && meta.touched && 'error') || ''}
            type={type}
            maxLength={maxLength}
            placeholder={placeholder} />
          {meta.error && meta.touched && <span className='error'>{meta.error}</span>}
        </div>
      </React.Fragment>
    )}
  </Field>
)

export const InputWrapper = ({ type, fieldName, validation, placeholder, maxLength, id }) => (
  <Field name={fieldName} validate={validation}>
    {({ input, meta }) => (
      <React.Fragment>
        <input {...input}
          id={id || `form-${fieldName}`}
          className={(meta.error && meta.touched && 'error') || ''}
          type={type}
          maxLength={maxLength}
          placeholder={placeholder} />
      </React.Fragment>
    )}
  </Field>
)

export const SelectField = ({ fieldName, label, blockNote, validation, id, options, onChange, className }) => (
  <Field name={fieldName} validate={validation} component='select'>
    {({ input, meta }) => (
      <React.Fragment>
        <div className={classNames('form-group', (meta.error && meta.touched && 'error') || '')} >
          { label && <label htmlFor={id || `form-${fieldName}`} className='form-label'>
            {`${label} `}
            {blockNote && <BlockNote value={blockNote} />}
          </label>}
          <select {...input}
            onChange={(event) => {
              input.onChange(event)
              onChange && onChange(event)
            }}
            id={id || `form-${fieldName}`}
            name={input.name}
            className={classNames(className || 'form-group', (meta.error && meta.touched && 'error') || '')}>
            { labelize(options).map((option) => generateHtmlOption(option))}
          </select>
          {meta.error && meta.touched && <span className='error'>{meta.error}</span>}
        </div>
      </React.Fragment>
    )}
  </Field>
)

export const CheckboxField = ({ fieldName, label, blockNote, validation, id, ariaLabelledby }) => (
  <Field name={fieldName} validate={validation} type='checkbox'>
    {({ input, meta }) => (
      <React.Fragment>
        <div className={classNames('form-group', (meta.error && meta.touched && 'error') || '')} >
          <input {...input}
            type='checkbox'
            id={id || `form-${fieldName}`}
            aria-labelledby={ariaLabelledby}
            className={(meta.error && meta.touched && 'error') || ''} />
          <label htmlFor={id || `form-${fieldName}`} className='form-label'>
            {label && `${label} `}
            {blockNote && <BlockNote value={blockNote} />}
          </label>
          {meta.error && meta.touched && <span className='error'>{meta.error}</span>}
        </div>
      </React.Fragment>
    )}
  </Field>
)

export const YesNoRadioField = ({ fieldName, uniqId, trueValue = 'true', trueLabel = 'Yes', falseValue = 'false', falseLabel = 'No', inputClassName, className }) => {
  const divClassName = classNames(className, 'radio-group-inline')
  return (
    <div className={divClassName}>
      <React.Fragment>
        <Field name={fieldName} value={trueValue} type='radio'>
          {({ input, meta }) => (
            <p className='radio-inline'>
              <input {...input} id={`${fieldName}-${uniqId}-yes`} className={inputClassName} type='radio' />
              <label className='radio-inline_label' htmlFor={`${fieldName}-${uniqId}-yes`}>{trueLabel}</label>
            </p>
          )}
        </Field>
        <Field name={fieldName} value={falseValue} type='radio'>
          {({ input, meta }) => (
            <p className='radio-inline'>
              <input {...input} id={`${fieldName}-${uniqId}-no`} className={inputClassName} type='radio' />
              <label className='radio-inline_label' htmlFor={`${fieldName}-${uniqId}-no`}>{falseLabel}</label>
            </p>
          )}
        </Field>
      </React.Fragment>
    </div>
  )
}

const generateHtmlOption = (option) => (
  <option key={option.value} value={option.value}>{option.label}</option>
)
