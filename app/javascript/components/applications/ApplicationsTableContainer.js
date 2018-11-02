import React from 'react'

import ApplicationsTable from './ApplicationsTable'
import ApplicationsFilter from './ApplicationsFilter'
import { EagerPagination, SERVER_PAGE_SIZE } from '~/utils/EagerPagination'

const ROWS_PER_PAGE = 20

class ApplicationsTableContainer extends React.Component {
  state = { loading: false, applications: [], pages: 0 }

  constructor (props) {
    super(props)
    this.eagerPagination = new EagerPagination(ROWS_PER_PAGE, SERVER_PAGE_SIZE)
  }

  loadPage = (page, filters) => {
    const { onFetchData } = this.props
    const fetcher = p => onFetchData(p, { filters })
    this.setState({ loading: true, page: page })
    this.eagerPagination.getPage(page, fetcher).then(({ records, pages }) => {
      this.setState({ applications: records, loading: false, pages: pages, maxPages: false })
    })
  }

  handleOnFetchData = (state, instance) => {
    const { filters } = this.state
    if (this.eagerPagination.isOverLimit(state.page)) {
      this.setState({ applications: [], loading: false, maxPages: true })
    } else {
      this.loadPage(state.page, filters)
    }
  }

  handleOnFilter = (filters) => {
    this.setState({ filters })
    this.eagerPagination.reset()
    this.loadPage(0, filters)
  }

  render () {
    const { listings } = this.props
    const { loading, applications, pages, maxPages } = this.state

    return (
      <React.Fragment>
        <ApplicationsFilter onSubmit={this.handleOnFilter} listings={listings} loading={loading} />
        <ApplicationsTable
          applications={applications}
          onFetchData={this.handleOnFetchData}
          pages={pages}
          loading={loading}
          rowsPerPage={ROWS_PER_PAGE}
          maxPages={maxPages}
        />
      </React.Fragment>
    )
  }
}

export default ApplicationsTableContainer
