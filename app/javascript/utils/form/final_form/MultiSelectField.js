import React from 'react'

import classNames from 'classnames'
import { Field } from 'react-final-form'

import MultiSelect from 'components/molecules/MultiSelect'

import { FieldError, HelpText, Label } from './Field'

const format = (options) => {
  return options && options.map((option) => (typeof option === 'string' ? option : option.value))
}

export const MultiSelectField = ({
  blockNote,
  disabled,
  fieldName,
  height,
  helpText,
  id,
  label,
  onChange,
  options,
  selectValue
}) => (
  <Field name={fieldName} component={MultiSelect} format={format} formatOnBlur>
    {({ input, meta }) => {
      return (
        <>
          <div className={classNames('form-group', { error: meta.error && meta.touched })}>
            <Label
              label={label}
              id={id || `form-${fieldName}`}
              fieldName={fieldName}
              blockNote={blockNote}
            />
            <MultiSelect
              {...input}
              options={options}
              height={height}
              value={input.value}
              onChange={(event) => {
                input.onChange(event)
                onChange && onChange(event)
              }}
              {...(disabled && { disabled })}
              {...(selectValue && { value: selectValue })}
            />
            <FieldError meta={meta} />
            {helpText && <HelpText note={helpText} describeId={`describe-${id || fieldName}`} />}
          </div>
        </>
      )
    }}
  </Field>
)
