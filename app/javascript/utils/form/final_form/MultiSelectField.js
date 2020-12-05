import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import MultiSelect, { MultiSelectItemShape } from 'components/molecules/MultiSelect'

import { FieldError, HelpText, Label } from './Field'

const format = (options) => {
  return options && options.map((option) => (typeof option === 'string' ? option : option.value))
}

const MultiSelectField = ({
  blockNote,
  disabled = false,
  fieldName,
  helpText,
  id,
  label,
  options,
  onChange = () => {}
}) => (
  <Field name={fieldName} component={MultiSelect} format={format} formatOnBlur>
    {({ input, meta }) => {
      // React Select in some cases returns an empty string and MultiSelect accepts only arrays
      const value = input.value === '' ? null : input.value
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
              value={value}
              onChange={(event) => {
                input.onChange(event)
                onChange && onChange(event)
              }}
              disabled={disabled}
            />
            <FieldError meta={meta} />
            {helpText && <HelpText note={helpText} describeId={`describe-${id || fieldName}`} />}
          </div>
        </>
      )
    }}
  </Field>
)

MultiSelectField.propTypes = {
  blockNote: PropTypes.string,
  disabled: PropTypes.bool,
  fieldName: PropTypes.string.isRequired,
  helpText: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(MultiSelectItemShape).isRequired
}

export default MultiSelectField
