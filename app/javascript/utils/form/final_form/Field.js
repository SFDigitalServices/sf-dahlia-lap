import React from 'react'
import { Field } from 'react-final-form'
import formOptions from '~/components/applications/application_form/formOptions'
import classNames from 'classnames'
import formUtils from '~/utils/formUtils'

const {
  labelize
} = formOptions

const FieldType = {
  Text: 0,
  Currency: 1,
  Percent: 2
}
Object.freeze(FieldType)

// Make react-final-form does include empty values on submit.
// Source: https://github.com/final-form/react-final-form/issues/130#issuecomment-425482365
const identity = (value, name, fieldType = FieldType.Text) => {
  if (value) {
    switch (fieldType) {
      case FieldType.Currency:
        // Here we remove anything that is not a numeric digit
        // or a decimal place while editing the field
        return value.toString().replace(/[^\d|.]/g, '')
      case FieldType.Percent:
        // Only allow digits for percent fields
        return value.toString().replace(/[^\d]/g, '')
    }
  }

  return value
}

export const BlockNote = ({ value }) => (
  <span className='checkbox-block_note no-margin padding-left--half'>{value}</span>
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

export const Label = ({ label, fieldName, blockNote, id, labelId, className }) => {
  return (
    label ? (
      <label htmlFor={id || `form-${fieldName}`} id={(labelId || `label-${fieldName}`).replace('.', '-')} className={className || 'form-label'}>
        {label}
        {blockNote && <BlockNote value={blockNote} />}
      </label>
    ) : null
  )
}

export const FieldError = ({meta}) => (
  meta.error && meta.touched ? <span className='error'>{meta.error}</span> : null
)

export const InputField = ({ fieldName, label, blockNote, validation, placeholder, maxLength, id, type }) => (
  <Field name={fieldName} validate={validation} parse={identity}>
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
            type={type || 'text'}
            placeholder={placeholder}
            maxLength={maxLength} />
          <FieldError meta={meta} />
        </div>
      </React.Fragment>
    )}
  </Field>
)

export const CurrencyField = ({ fieldName, validation, id, label, placeholder, maxLength, disabled, isDirty = true }) => (
  <Field
    name={fieldName}
    validate={validation}
    component='input'
    format={formUtils.formatPrice}
    parse={(value, name) => identity(value, name, FieldType.Currency)}
    formatOnBlur={isDirty}
  >
    {({ input, meta }) => (
      <div className={classNames((label && 'form-group'), (meta.error && meta.touched && 'error') || '')} >
        <Label
          label={label}
          id={id || `form-${fieldName}`}
          fieldName={fieldName} />
        <input {...input}
          id={id || `form-${fieldName}`}
          placeholder={placeholder || '$0.00'}
          className={(meta.error && meta.touched && 'error') || ''}
          maxLength={maxLength}
          disabled={disabled} />
        <FieldError meta={meta} />
      </div>
    )}
  </Field>
)

/**
 * Field that allows only whole integer percent values.
 */
export const PercentField = ({ fieldName, validation, id, label, placeholder, maxLength, disabled, isDirty = true }) => (
  <Field
    name={fieldName}
    validate={validation}
    component='input'
    format={formUtils.formatPercent}
    parse={(value, name) => identity(value, name, FieldType.Percent)}
    formatOnBlur={isDirty}
  >
    {({ input, meta }) => (
      <div className={classNames((label && 'form-group'), (meta.error && meta.touched && 'error') || '')} >
        <Label
          label={label}
          id={id || `form-${fieldName}`}
          fieldName={fieldName} />
        <input {...input}
          id={id || `form-${fieldName}`}
          placeholder={placeholder || '$0.00'}
          className={(meta.error && meta.touched && 'error') || ''}
          maxLength={maxLength}
          disabled={disabled} />
        <FieldError meta={meta} />
      </div>
    )}
  </Field>
)

export const SelectField = ({ fieldName, label, blockNote, validation, id, options, onChange, className, disabled = false, disabledOptions, selectValue, noPlaceholder }) => (
  <Field
    name={fieldName}
    validate={validation}
    component='select'
    parse={identity}
  >
    {({ input, meta }) => {
      const selectOptions = disabled && disabledOptions ? disabledOptions : labelize(options, {}, noPlaceholder)
      return (
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
              className={classNames(className, (meta.error && meta.touched && 'error') || '')}
              {...(selectValue && { value: selectValue })}
              {...(disabled && { disabled })}>
              { selectOptions.map(({ value, label, disabled }) => (
                <option key={value} value={value} disabled={disabled}>{label}</option>
              )) }
            </select>
            <FieldError meta={meta} />
          </div>
        </React.Fragment>
      )
    }}
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

const YesNoRadioField = ({ value, label, type, fieldName, className, uniqId }) => (
  <Field name={fieldName} value={value} type='radio'>
    {({ input }) => (
      <p className='radio-inline'>
        <input {...input} id={`${fieldName}-${uniqId}-${type}`} className={className} type='radio' />
        <label className='radio-inline_label' htmlFor={`${fieldName}-${uniqId}-${type}`}>{label}</label>
      </p>
    )}
  </Field>
)

export const YesNoRadioGroup = ({ fieldName, uniqId, trueValue = 'true', trueLabel = 'Yes', falseValue = 'false', falseLabel = 'No', inputClassName, className, label }) => {
  const divClassName = classNames(className, 'radio-group-inline')
  return (
    <div className={divClassName}>
      <React.Fragment>
        <Label
          label={label}
          id={`form-${fieldName}`}
          fieldName={fieldName} />
        <YesNoRadioField
          value={trueValue}
          label={trueLabel}
          type='yes'
          fieldName={fieldName}
          className={inputClassName}
          uniqId={uniqId}
        />
        <YesNoRadioField
          value={falseValue}
          label={falseLabel}
          type='no'
          fieldName={fieldName}
          className={inputClassName}
          uniqId={uniqId}
        />
      </React.Fragment>
    </div>
  )
}

export const TextAreaField = ({ fieldName, label, labelId, cols, rows, validation, placeholder, maxLength, id, ariaDescribedby, blockNote, labelClass }) => (
  <Field name={fieldName} validate={validation} component='textarea' parse={identity}>
    {({ input, meta }) => (
      <React.Fragment>
        <div className={classNames((label && 'form-group'), (meta.error && meta.touched && 'error') || '')} >
          <Label
            label={label}
            labelId={labelId}
            id={id || `form-${fieldName}`}
            fieldName={fieldName}
            blockNote={blockNote}
            className={labelClass} />
          <textarea {...input}
            id={id || `form-${fieldName}`}
            className={(meta.error && meta.touched && 'error') || ''}
            placeholder={placeholder}
            maxLength={maxLength}
            cols={cols}
            rows={rows}
            aria-describedby={ariaDescribedby} />
          <FieldError meta={meta} />
        </div>
      </React.Fragment>
    )}
  </Field>
)
