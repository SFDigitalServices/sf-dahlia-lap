import React from 'react'
import PropTypes from 'prop-types';

export const withFormApi = (Component) => {
  class Wrapper extends React.Component {
    render() {
      const { formApi } = this.context // Old context API used by react-form

      return <Component formApi={formApi} {...this.props} />
    }
  }

  // Old context API used by react-form
  Wrapper.contextTypes = {
    formApi: PropTypes.object
  }

  return Wrapper
}
