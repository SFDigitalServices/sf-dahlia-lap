import React from 'react'
import { flow } from 'lodash'

import LeaseUpApplicationsTableContainer from './LeaseUpApplicationsTableContainer'
import TableLayout from '../layouts/TableLayout'
import mapProps from '~/utils/mapProps'
import { mapListing, mapApplicationPreference } from '~/components/mappers/soqlToDomain'
import { buildLeaseUpModel } from './leaseUpModel'
import appPaths from '~/utils/appPaths'
import apiService from '~/apiService'
import EagerPagination from '~/utils/EagerPagination'
import Context from './context'
import { isEmpty } from 'lodash'

class LeaseUpApplicationsPage extends React.Component {
  state = { loading: false, applications: [], pages: 0 }

  constructor (props) {
    super(props)
    // this should belong to the page too.
    this.eagerPagination = new EagerPagination(20, 100)
  }

  fetchApplications = async (page) => {
    console.log('fetching applications: ', this.props.listing, page)
    // FIXME, need to figure out a way to map listing to get Id
    const response = await apiService.fetchLeaseUpApplications(this.props.listing.Id, page)
    console.log('fetch applications response', response)
    return {
      records: !isEmpty(response.records) ? response.records.map(flow(mapApplicationPreference, buildLeaseUpModel)): [],
      pages: response.pages
    }
  }

  // on fetch applications (call API service), then pass down as a context?
  loadPage = (page) => {
    const fetcher = p => this.fetchApplications(p)
    this.setState({ loading: true, page: page })
    this.eagerPagination.getPage(page, fetcher).then(({ records, pages }) => {
      this.setState({ applications: records, loading: false, pages: pages })
    })
  }

  handleOnFetchData = (state, instance) => {
    console.log('handleOnFetchData is being called')
    this.loadPage(state.page)
  }

  render () {
    console.log('props', this.props)
    const listing = mapListing(this.props.listing)

    const pageHeader = {
      title: listing.name,
      content: listing.building_street_address,
      action: {
        title: 'Export',
        link: `/listings/${listing.id}/lease-ups/export`
      },
      breadcrumbs: [
        {title: 'Lease Ups', link: '/listings/lease-ups'},
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
          <LeaseUpApplicationsTableContainer/>
        </TableLayout>
      </Context.Provider>
    )
  }
}

export default LeaseUpApplicationsPage
