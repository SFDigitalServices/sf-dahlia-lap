import React from 'react'
import { Field } from 'react-final-form'
import formOptions from '~/components/applications/application_form/formOptions'

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
        <div className={(meta.error && meta.touched && 'error') || ''} >
          <label htmlFor={id || `form-${fieldName}`} className='form-label'>
            {label && `${label} `}
            {blockNote && <BlockNote value={blockNote} />}
          </label>
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

export const SelectField = ({ fieldName, label, blockNote, validation, placeholder, maxLength, id, options, onChange }) => (
  <Field name={fieldName} validate={validation} component='select'>
    {({ input, meta }) => (
      <React.Fragment>
        <div className={(meta.error && meta.touched && 'error') || ''} >
          <label htmlFor={id || `form-${fieldName}`} className='form-label'>
            {label && `${label} `}
            {blockNote && <BlockNote value={blockNote} />}
          </label>
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
        <div className={(meta.error && meta.touched && 'error') || ''} >
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

const generateHtmlOption = (option) => (
  <option key={option.value} value={option.value}>{option.label}</option>
)
