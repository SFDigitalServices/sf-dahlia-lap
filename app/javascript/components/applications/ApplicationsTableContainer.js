import React from 'react'

import ApplicationsTable from './ApplicationsTable'
import EagerPagination from '~/utils/EagerPagination'

class ApplicationsTableContainer extends React.Component {
  state = { loading: false, applications: [], pages: 0 }

  constructor(props) {
    super(props)
    this.eagerPagination = new EagerPagination(20, 100, props.onFetchData)
  }

  handleOnFetchData = (state, instance) => {
    this.setState({ loading: true })
    this.eagerPagination.getPage(state.page + 1).then(({ records, pages }) => {
      this.setState({ applications: records, loading: false, pages: pages })
    })
  }

  render() {
    const { loading, pages } = this.state
    return <ApplicationsTable
              onFetchData={this.handleOnFetchData}
              pages={pages}
              loading={loading} />
  }
}

export default ApplicationsTableContainer
