import React from 'react'

import ApplicationsTable from './ApplicationsTable'

class ApplicationsTableContainer extends React.Component {
  state = { loading: false }

  handleOnFetchData = (state, instance) => {
    console.log('fetch data')
    this.setState({ loading: true })
    this.props.fetchData().then(() => {
      console.log('fetchData.then')
      this.setState({loading: false })
    })
  }

  render() {
    const { loading } = this.state
    return (
      <ApplicationsTable
        {...this.props}
        onFetchData={this.handleOnFetchData}
        loading={loading} />
    )
  }
}

export default ApplicationsTableContainer
