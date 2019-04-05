import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Checkbox, Select, Text } from 'react-form'

import { FormError, errorClassName } from './errors'

export const BlockNote = ({ value }) => (
  <span className='checkbox-block_note no-margin'>{value}</span>
)

export const Field = ({ formApi, field, label, blockNote, labelLast, errorMessage, children }) => {
  const labelMarkup = (field, label, blockNote) => {
    return (
      <label className='form-label' htmlFor={field} key={field + '_label'}>
        {`${label} `}
        {blockNote && <BlockNote value={blockNote} />}
      </label>
    )
  }
  const className = errorClassName(formApi, field)
  let contentMarkup = null
  if (labelLast) {
    contentMarkup = [children(field, classNames(className)), labelMarkup(field, label, blockNote)]
  } else {
    contentMarkup = [labelMarkup(field, label, blockNote), children(field, classNames(className))]
  }
  return (
    <div className={classNames('form-group', className)}>
      { contentMarkup }
      <FormError formApi={formApi} label={label} field={field} errorMessage={errorMessage} />
    </div>
  )
}

export const withField = (input) => {
  class Wrapper extends React.Component {
    render () {
      const { field, errorMessage, label, blockNote, className, labelLast, ariaLabelledby, ...rest } = this.props
      const { formApi } = this.context // Old context API used by react-form

      return (
        <Field formApi={formApi} field={field} label={label} blockNote={blockNote} labelLast={labelLast} errorMessage={errorMessage}>
          {(f, errorClassNames) => (input(f, classNames(className, errorClassNames), {key: field + '_children', 'aria-labelledby': ariaLabelledby, ...rest}))}
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
  withField((field, className, rest) => {
    return <Comp id={field} field={field} className={className} {...rest} />
  })
)

Field.Select = decorateInput(Select)
Field.Text = decorateInput(Text)
Field.Checkbox = decorateInput(Checkbox)
