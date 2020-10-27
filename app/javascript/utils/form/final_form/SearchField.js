import React from 'react'
import { Field } from 'react-final-form'
import classNames from 'classnames'
import { Label, FieldError, HelpText } from './Field'

export const Input = ({
  input,
  id,
  meta,
  type,
  maxLength,
  placeholder,
  ariaLabelledby,
  fieldName,
  disabled
}) => (
  <input
    {...input}
    id={id || `form-${fieldName}`}
    className={(meta.error && meta.touched && 'error') || ''}
    type={type}
    maxLength={maxLength}
    aria-labelledby={ariaLabelledby}
    placeholder={placeholder}
    disabled={disabled}
  />
)

export const SearchField = ({
  fieldName,
  label,
  blockNote,
  validation,
  placeholder,
  maxLength,
  id,
  type,
  helpText,
  parse,
  format,
  disabled = false,
  isClearable = false,
  formatOnBlur = false,
  isDirty = false,
  onClearClick
}) => (
  <Field
    name={fieldName}
    validate={validation}
    format={format}
    formatOnBlur={formatOnBlur && isDirty}
  >
    {({ input, meta }) => {
      console.log(input, meta)
      const hasValue = !!input.value
      return (
        <>
          <div
            className={classNames(
              label && 'form-group',
              (meta.error && meta.touched && 'error') || ''
            )}
            style={{ display: 'inline-block', position: 'relative' }}
          >
            <Label
              label={label}
              id={id || `form-${fieldName}`}
              fieldName={fieldName}
              blockNote={blockNote}
            />
            <input
              {...input}
              id={id || `form-${fieldName}`}
              className={(meta.error && meta.touched && 'error') || ''}
              type='text'
              maxLength={maxLength}
              // aria-labelledby={ariaLabelledby}
              placeholder={placeholder}
              disabled={disabled}
              style={{ paddingRight: hasValue && '2.5rem', width: '15rem' }}
            />
            {hasValue && (
              <button
                className='ui-medium i-aluminum button-link'
                style={{ position: 'absolute', right: '12px', top: '13.5px', height: '16px' }}
                onClick={onClearClick}
              >
                <svg>
                  <use xlinkHref={`#i-close-round`} />
                </svg>
              </button>
            )}
            <FieldError meta={meta} />
            {helpText && <HelpText note={helpText} describeId={`describe-${id || fieldName}`} />}
          </div>
        </>
      )
    }}
  </Field>
)
