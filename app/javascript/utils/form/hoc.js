// This files contains some High Level Components for helping building forms.

import React from 'react'
import PropTypes from 'prop-types'
import { NestedForm, Form } from 'react-form'

// You can wrap your component wit this HOC to get access to the formApi in your component.
// formApi is being pulled from the context.
export const withFormApi = (Component) => {
  class WithFormApi extends React.Component {
    render () {
      const { formApi } = this.context // Old context API used by react-form

      return <Component formApi={formApi} {...this.props} />
    }
  }

  // Old context API used by react-form
  WithFormApi.contextTypes = {
    formApi: PropTypes.object
  }

  return WithFormApi
}

// You can wrap your component with this HOC if you are going to be using a nested form.
// You need to pass the nested field name for parent component.
export const withNestedForm = (field, Component) => {
  const WithNestedForm = ({ formApi, ...rest }) => (
    <NestedForm field={field} >
      <Form defaultValues={formApi.values[field]}>
        { nestedFormApi => <Component formApi={nestedFormApi} {...rest} /> }
      </Form>
    </NestedForm>
  )

  return withFormApi(WithNestedForm)
}
