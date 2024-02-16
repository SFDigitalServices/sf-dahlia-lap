import React from 'react'

import Alert from 'components/organisms/Alert'

class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.debug(error, info)
  }

  render() {
    if (this.state.hasError) {
      return <Alert title='An error occurred. Check back later.' />
    }
    return <div>{this.props.children}</div>
  }
}

export default ErrorBoundary
