// This files contains some High-Order Components for building forms.
// https://reactjs.org/docs/higher-order-components.html

import React from 'react'
import PropTypes from 'prop-types'
import { NestedForm, Form } from 'react-form'

// You can wrap your component with this HOC to get access to the formApi in your component.
// formApi is being pulled from the context.
// Ex: export default withFormApi(Component)
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

// You can wrap your component with this HOC if you are using a nested form.
// It's not required, it just saves some typing.
// You need to pass the nested field name for the parent component.
// Ex: export default withNestedForm(Component)
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
