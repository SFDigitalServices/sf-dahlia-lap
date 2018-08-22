import React from 'react'
import PropTypes from 'prop-types'
import { NestedForm, Form } from 'react-form'

export const withFormApi = (Component) => {
  class WithFormApi extends React.Component {
    render() {
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
