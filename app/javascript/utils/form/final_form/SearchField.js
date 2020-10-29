import React from 'react'
import { Field } from 'react-final-form'
import classNames from 'classnames'
import { Label, FieldError, HelpText } from './Field'

const SearchField = ({
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
      const hasValue = !!input.value
      return (
        <>
          <div
            className={classNames('search', {
              'form-group': label,
              error: meta.error && meta.touched
            })}
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
              className={classNames({ 'has-value': hasValue, error: meta.error && meta.touched })}
              type='text'
              maxLength={maxLength}
              placeholder={placeholder}
              disabled={disabled}
            />
            {hasValue && (
              <button
                className='ui-medium i-aluminum button-link search-icon'
                onClick={onClearClick}
                type='button'
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

export default SearchField
