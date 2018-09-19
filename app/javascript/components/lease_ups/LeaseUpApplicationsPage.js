import React from 'react'
import { flow, map } from 'lodash'

import LeaseUpApplicationsTableContainer from './LeaseUpApplicationsTableContainer'
import TableLayout from '../layouts/TableLayout'
import { mapListing, mapApplicationPreference } from '~/components/mappers/soqlToDomain'
import { buildLeaseUpModel } from './leaseUpModel'
import appPaths from '~/utils/appPaths'
import apiService from '~/apiService'
import { EagerPagination, SERVER_PAGE_SIZE } from '~/utils/EagerPagination'
import Context from './context'
import mapProps from '~/utils/mapProps'

const ROWS_PER_PAGE = 5

class LeaseUpApplicationsPage extends React.Component {
  state = { loading: false, applications: [], pages: 0 }

  constructor (props) {
    super(props)
    this.eagerPagination = new EagerPagination(ROWS_PER_PAGE, SERVER_PAGE_SIZE)
  }

  fetchApplications = async (page) => {
    const response = await apiService.fetchLeaseUpApplications(this.props.listing.id, page)
    return {
      records: map(response.records, flow(mapApplicationPreference, buildLeaseUpModel)),
      pages: response.pages
    }
  }

  loadPage = async (page) => {
    const fetcher = p => this.fetchApplications(p)
    this.setState({ loading: true, page: page })
    const { records, pages } = await this.eagerPagination.getPage(page, fetcher)
    this.setState({ applications: records, loading: false, pages: pages })
  }

  handleOnFetchData = (state, instance) => {
    this.loadPage(state.page)
  }

  render () {
    const listing = this.props.listing

    const pageHeader = {
      title: listing.name,
      content: listing.building_street_address,
      action: {
        title: 'Export',
        link: `/listings/${listing.id}/lease-ups/export`
      },
      breadcrumbs: [
        {title: 'Lease Ups', link: appPaths.toLeaseUps()},
        {title: listing.name, link: appPaths.toLeaseUpApplications(listing.id)}
      ]
    }

    const context = {
      applications: this.state.applications,
      listing: listing,
      handleOnFetchData: this.handleOnFetchData,
      loading: this.state.loading,
      pages: this.state.pages,
      rowsPerPage: ROWS_PER_PAGE
    }

    return (
      <Context.Provider value={context}>
        <TableLayout pageHeader={pageHeader}>
          <LeaseUpApplicationsTableContainer />
        </TableLayout>
      </Context.Provider>
    )
  }
}

const mapProperties = ({ listing }) => {
  return {
    listing: mapListing(listing)
  }
}

export default mapProps(mapProperties)(LeaseUpApplicationsPage)
