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

export const Input = ({ input, id, meta, type, maxLength, placeholder, ariaLabelledby, fieldName }) => (
  <input {...input}
    id={id || `form-${fieldName}`}
    className={(meta.error && meta.touched && 'error') || ''}
    type={type}
    maxLength={maxLength}
    aria-labelledby={ariaLabelledby}
    placeholder={placeholder} />
)

export const Label = ({ label, fieldName, blockNote, id }) => {
  if (label) {
    return (
      <label htmlFor={id || `form-${fieldName}`} className='form-label'>
        {label && `${label} `}
        {blockNote && <BlockNote value={blockNote} />}
      </label>)
  } else {
    return null
  }
}

export const FieldError = ({meta}) => (
  meta.error && meta.touched ? <span className='error'>{meta.error}</span> : null
)

export const TextField = ({ fieldName, label, blockNote, validation, placeholder, maxLength, id }) => (
  <Field name={fieldName} validate={validation}>
    {({ input, meta }) => (
      <React.Fragment>
        <div className={classNames((label && 'form-group'), (meta.error && meta.touched && 'error') || '')} >
          <Label
            label={label}
            id={id || `form-${fieldName}`}
            fieldName={fieldName}
            blockNote={blockNote} />
          <Input
            input={input}
            meta={meta}
            id={id || `form-${fieldName}`}
            type='text'
            placeholder={placeholder}
            maxLength={maxLength} />
          <FieldError meta={meta} />
        </div>
      </React.Fragment>
    )}
  </Field>
)

export const InputField = ({ type, fieldName, validation, placeholder, maxLength, id }) => (
  <Field name={fieldName} validate={validation}>
    {({ input, meta }) => (
      <React.Fragment>
        <Input
          input={input}
          type={type}
          meta={meta}
          id={id || `form-${fieldName}`}
          placeholder={placeholder}
          maxLength={maxLength} />
      </React.Fragment>
    )}
  </Field>
)

export const SelectField = ({ fieldName, label, blockNote, validation, id, options, onChange }) => (
  <Field name={fieldName} validate={validation} component='select'>
    {({ input, meta }) => (
      <React.Fragment>
        <div className={classNames('form-group', (meta.error && meta.touched && 'error') || '')} >
          <Label
            label={label}
            id={id || `form-${fieldName}`}
            fieldName={fieldName}
            blockNote={blockNote} />
          <select {...input}
            onChange={(event) => {
              input.onChange(event)
              onChange && onChange(event)
            }}
            id={id || `form-${fieldName}`}
            name={input.name}
            className={(meta.error && meta.touched && 'error') || ''}>
            { labelize(options).map((option) => generateHtmlOption(option))}
          </select>
          <FieldError meta={meta} />
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
          <Input
            input={input}
            type='checkbox'
            meta={meta}
            aria-labelledby={ariaLabelledby}
            id={id || `form-${fieldName}`} />
          <Label
            label={label}
            id={id || `form-${fieldName}`}
            fieldName={fieldName}
            blockNote={blockNote} />
          <FieldError meta={meta} />
        </div>
      </React.Fragment>
    )}
  </Field>
)

const generateHtmlOption = (option) => (
  <option key={option.value} value={option.value}>{option.label}</option>
)
