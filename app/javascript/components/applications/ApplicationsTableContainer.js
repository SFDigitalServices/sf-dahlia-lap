import React from 'react'

import ApplicationsTable from './ApplicationsTable'
import EagerPagination from '~/utils/EagerPagination'

class ApplicationsTableContainer extends React.Component {
  state = { loading: false, applications: [], pages: 0 }

  constructor(props) {
    super(props)
    this.eagerPagination = new EagerPagination(20, (serverPage) => {
      return this.props.onFetchData(serverPage)
    })
  }

  // fetchRemoteData = (page) => {
  //   this.setState({ loading: true })
  //   this.props.onFetchData(page).then((response) => {
  //     console.log('onFetchData.then')
  //     console.log(response)
  //     this.setState({
  //       applications: response.result,
  //       loading: false,
  //       pages: response.pages,
  //       size: response.size
  //     })
  //   })
  // }

  handleOnFetchData = (state, instance) => {
    // this.fetchRemoteData(state.page)
    this.setState({ loading: true })
    this.eagerPagination.loadPage(state.page, (records, pages) => {
      this.setState({
        applications: records,
        loading: false,
        pages: pages
      })
    })
  }

  render() {
    const { loading, applications, pages } = this.state
    return <ApplicationsTable
              applications={applications}
              onFetchData={this.handleOnFetchData}
              pages={pages}
              loading={loading} />
  }
}

export default ApplicationsTableContainer
