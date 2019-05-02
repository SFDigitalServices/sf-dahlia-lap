import React from 'react'
import { Field } from 'react-final-form'


export const BlockNote = ({ value }) => (
  <span className='checkbox-block_note no-margin'>{value}</span>
)

export const FieldWrapper = ({ type, fieldName, label, blockNote, validation, placeholder, maxLength, id }) => (
  <Field name={fieldName} validate={validation}>
    {({ input, meta }) => (
      <React.Fragment>
        <div className={(meta.error && meta.touched && 'error') || ''} >
          <label htmlFor={`form-${fieldName}`}>
            {label}
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

// export const SimpleCheckbox = ({ fieldName, label }) => (
//   <Field name={fieldName}>
//     {({ input, meta }) => (
//       <React.Fragment>
//         <input {...input} id={`form-${fieldName}`} type='checkbox' />
//         <label htmlFor={`form-${fieldName}`}>{label}</label>
//       </React.Fragment>
//     )}
//   </Field>
// )





// import React from 'react'
// import PropTypes from 'prop-types'
// import classNames from 'classnames'
// import { Field } from 'react-final-form'

// import { FormError, errorClassName } from './errors'

// export const BlockNote = ({ value }) => (
//   <span className='checkbox-block_note no-margin'>{value}</span>
// )

// export const FieldWrapper = ({ name, label, blockNote, labelLast, errorMessage, children }) => {
//   const labelMarkup = (name, label, blockNote) => {
//     return (
//       <label className='form-label' htmlFor={name} key={name + '_label'}>
//         {`${label} `}
//         {blockNote && <BlockNote value={blockNote} />}
//       </label>
//     )
//   }
//   const className = errorClassName(formApi, name)
//   let contentMarkup = null
//   if (labelLast) {
//     contentMarkup = [children(name, classNames(className)), labelMarkup(name, label, blockNote)]
//   } else {
//     contentMarkup = [labelMarkup(name, label, blockNote), children(name, classNames(className))]
//   }
//   return (
//     <div className={classNames('form-group', className)}>
//       { contentMarkup }
//       <FormError formApi={formApi} label={label} name={name} errorMessage={errorMessage} />
//     </div>
//   )
// }

// export const withField = (input) => {
//   class Wrapper extends React.Component {
//     render () {
//       const { name, errorMessage, label, blockNote, className, labelLast, ariaLabelledby, ...rest } = this.props

//       return (
//         <FieldWrapper name={name} label={label} blockNote={blockNote} labelLast={labelLast} errorMessage={errorMessage}>
//           {(f, errorClassNames) => (input(f, classNames(className, errorClassNames), {key: name + '_children', 'aria-labelledby': ariaLabelledby, ...rest}))}
//         </FieldWrapper>
//       )
//     }
//   }
//   return Wrapper
// }

// const decorateInput = (type) => (
//   withField((name, className, rest) => {
//     return <Field component="input" type={type} id={name} name={name} className={className} {...rest} />
//   })
// )

// const decorateSelect = () => (
//   withField((name, className, rest) => {
//     return <Field component="select" id={name} name={name} className={className} {...rest} />
//   })
// )

// FieldWrapper.Select = decorateSelect()
// FieldWrapper.Text = decorateInput("text")
// FieldWrapper.Checkbox = decorateInput("checkbox")
