import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import MultiSelect from 'components/molecules/MultiSelect'

import { FieldError, HelpText, Label } from './Field'

const format = (options) => {
  return options && options.map((option) => (typeof option === 'string' ? option : option.value))
}
const HEIGHT_NORMAL = 'normal'
const HEIGHT_SMALL = 'small'

const MultiSelectField = ({
  blockNote,
  disabled = false,
  fieldName,
  height = HEIGHT_NORMAL,
  helpText,
  id,
  label,
  options,
  onChange = () => {}
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

const MultiSelectFieldShape = PropTypes.shape({
  value: PropTypes.string,
  label: PropTypes.string
})

MultiSelectField.propTypes = {
  blockNote: PropTypes.string,
  disabled: PropTypes.bool,
  fieldName: PropTypes.string.isRequired,
  height: PropTypes.oneOf([HEIGHT_NORMAL, HEIGHT_SMALL]),
  helpText: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(MultiSelectFieldShape).isRequired
}

export default MultiSelectField
