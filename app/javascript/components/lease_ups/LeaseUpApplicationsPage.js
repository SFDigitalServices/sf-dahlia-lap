import React from 'react'
import { flow, isEmpty } from 'lodash'

import LeaseUpApplicationsTableContainer from './LeaseUpApplicationsTableContainer'
import TableLayout from '../layouts/TableLayout'
import { mapListing, mapApplicationPreference } from '~/components/mappers/soqlToDomain'
import { buildLeaseUpModel } from './leaseUpModel'
import appPaths from '~/utils/appPaths'
import apiService from '~/apiService'
import EagerPagination from '~/utils/EagerPagination'
import Context from './context'

class LeaseUpApplicationsPage extends React.Component {
  state = { loading: false, applications: [], pages: 0 }

  constructor (props) {
    super(props)
    this.eagerPagination = new EagerPagination(20, 100)
  }

  fetchApplications = async (page) => {
    // FIXME, need to figure out a way to map listing to get Id
    const response = await apiService.fetchLeaseUpApplications(this.props.listing.Id, page)
    return {
      records: !isEmpty(response.records) ? response.records.map(flow(mapApplicationPreference, buildLeaseUpModel)) : [],
      pages: response.pages
    }
  }

  loadPage = (page) => {
    const fetcher = p => this.fetchApplications(p)
    this.setState({ loading: true, page: page })
    this.eagerPagination.getPage(page, fetcher).then(({ records, pages }) => {
      this.setState({ applications: records, loading: false, pages: pages })
    })
  }

  handleOnFetchData = (state, instance) => {
    this.loadPage(state.page)
  }

  render () {
    const listing = mapListing(this.props.listing)

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
      pages: this.state.pages
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

export default LeaseUpApplicationsPage
