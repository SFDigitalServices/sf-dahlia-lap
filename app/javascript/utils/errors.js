import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames'
import { Select, Text } from 'react-form'

export const hasError = (formApi, field) => {
  if (formApi.getTouched(field) || formApi.submits > 0)
    return !!formApi.getError(field)
  else
    return null
}

export const FormError = ({ formApi, label, field }) => {
  if (hasError(formApi, field))
    return (
      <span className="small error">
        {label} {formApi.getError(field)}
      </span>)
  else
    return null
}

export const errorClassName = (formApi, field) => {
  return { error: hasError(formApi, field) }
}

const BlockNote = ({ value }) => (
  <span className="checkbox-block_note no-margin">{value}</span>
)

export const Field = ({ formApi, field, label, blockNote, children }) => {
  const className = errorClassName(formApi, field)

  return (
    <div className={classNames('form-group', className)}>
      <label className='form-label' htmlFor={field}>
        {label}
        {blockNote && <BlockNote value={blockNote} />}
      </label>
      { children(field, classNames(className)) }
      <FormError formApi={formApi} label={label} field={field}/>
    </div>
  )
}

const withField = (input) => {
  class Wrapper extends React.Component {
    render() {
      const { field, label, ...rest } = this.props
      const { formApi } = this.context // Old context API used by react-form

      return (
        <Field formApi={formApi} field={field} label={label}>
          {(f, classNames) => (input(f, classNames, rest))}
        </Field>
      )
    }
  }

  // Old context API used by react-form
  Wrapper.contextTypes = {
    formApi: PropTypes.object
  }

  return Wrapper
}

const decorateInput = (Comp) => (
  withField((field, classNames, rest) => {
    return <Comp id={field} field={field} className={classNames} {...rest} />
  })
)

Field.Select = decorateInput(Select)
Field.Text = decorateInput(Text)
