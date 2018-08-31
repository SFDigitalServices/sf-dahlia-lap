import React from 'react'

import ApplicationsTable from './ApplicationsTable'
import ApplicationsFilter from './ApplicationsFilter'
import EagerPagination from '~/utils/EagerPagination'

class ApplicationsTableContainer extends React.Component {
  state = { loading: false, applications: [], pages: 0 }

  constructor (props) {
    super(props)
    this.eagerPagination = new EagerPagination(20, 100)
  }

  loadPage = (page, filters) => {
    const { onFetchData } = this.props
    const fetcher = p => onFetchData(p, { filters })
    this.setState({ loading: true, page: page })
    this.eagerPagination.getPage(page, fetcher).then(({ records, pages }) => {
      this.setState({ applications: records, loading: false, pages: pages })
    })
  }

  handleOnFetchData = (state, instance) => {
    const { filters } = this.state
    this.loadPage(state.page, filters)
  }

  handleOnFilter = (filters) => {
    this.setState({ filters })
    this.eagerPagination.reset()
    this.loadPage(0, filters)
  }

  render () {
    const { listings } = this.props
    const { loading, applications, pages } = this.state

    return (
      <React.Fragment>
        <ApplicationsFilter onSubmit={this.handleOnFilter} listings={listings} loading={loading} />
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
