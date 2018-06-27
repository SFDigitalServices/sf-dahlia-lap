import React from 'react'

import ApplicationsTable from './ApplicationsTable'
import ApplicationsFilter from './ApplicationsFilter'
import EagerPagination from '~/utils/EagerPagination'

class ApplicationsTableContainer extends React.Component {
  state = { loading: false, applications: [], pages: 0 }

  constructor(props) {
    super(props)
    this.eagerPagination = new EagerPagination(20, 100, props.onFetchData)
  }

  loadPage = (page, options) => {
    this.setState({ loading: true, page: page })
    this.eagerPagination.getPage(page, options).then(({ records, pages }) => {
      this.setState({ applications: records, loading: false, pages: pages })
    })
  }

  handleOnFetchData = (state, instance) => {
    const { filters } = this.state
    const page = state.page
    this.loadPage(page, { filters })
  }

  handleOnFilter = (filters) => {
    const page = 0
    this.setState({ filters })
    this.setState({ loading: true, page: page })
    this.eagerPagination.reset()
    this.loadPage(page, { filters })
  }

  render() {
    const { listings } = this.props
    const { loading, applications, pages } = this.state

    return (
      <React.Fragment>
        <ApplicationsFilter onSubmit={this.handleOnFilter} listings={listings} loading={loading}/>
        <ApplicationsTable
          applications={applications}
          onFetchData={this.handleOnFetchData}
          pages={pages}
          loading={loading} />
      </React.Fragment>
    )
  }
}

export default ApplicationsTableContainer
