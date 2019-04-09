/* global SALESFORCE_BASE_URL */

import React from 'react'
import { flow, map, each, set, clone } from 'lodash'
import moment from 'moment'

import LeaseUpApplicationsTableContainer from './LeaseUpApplicationsTableContainer'
import TableLayout from '../layouts/TableLayout'
import { mapListing, mapApplicationPreference, mapApplication } from '~/components/mappers/soqlToDomain'
import { buildLeaseUpAppPrefModel } from './leaseUpAppPrefModel'
import { buildLeaseUpAppGenLotteryModel } from './leaseUpAppGenLotteryModel'
import appPaths from '~/utils/appPaths'
import apiService from '~/apiService'
import { EagerPagination, SERVER_PAGE_SIZE } from '~/utils/EagerPagination'
import Context from './context'
import mapProps from '~/utils/mapProps'
import { SALESFORCE_DATE_FORMAT } from '~/utils/utils'

const ROWS_PER_PAGE = 20

class LeaseUpApplicationsPage extends React.Component {
  state = {
    loading: false,
    applications: [],
    pages: 0,
    atMaxPages: false,
    statusModal: {
      isOpen: false,
      status: null,
      applicationId: null,
      showAlert: null,
      loading: false
    }
  }

  constructor (props) {
    super(props)
    this.eagerPagination = new EagerPagination(ROWS_PER_PAGE, SERVER_PAGE_SIZE)
  }

  fetchApplications = async (page, filters) => {
    const response = await apiService.fetchLeaseUpApplications(this.props.listing.id, page, {filters})
    let records
    if (filters && filters.preference === 'general') {
      records = map(response.records, flow(mapApplication, buildLeaseUpAppGenLotteryModel))
    } else {
      records = map(response.records, flow(mapApplicationPreference, buildLeaseUpAppPrefModel))
    }
    return {
      records: records,
      pages: response.pages
    }
  }

  loadPage = async (page, filters) => {
    const fetcher = p => this.fetchApplications(p, filters)
    this.setState({ loading: true, page: page })
    const { records, pages } = await this.eagerPagination.getPage(page, fetcher)
    this.setState({ applications: records, loading: false, pages: pages, atMaxPages: false })
  }

  handleOnFetchData = (state, instance) => {
    const { filters } = this.state
    if (this.eagerPagination.isOverLimit(state.page)) {
      this.setState({
        applications: [],
        loading: false,
        atMaxPages: true
      })
    } else {
      this.loadPage(state.page, filters)
    }
  }

  handleOnFilter = (filters) => {
    this.setState({ filters })
    this.eagerPagination.reset()
    this.loadPage(0, filters)
  }

  handleCreateStatusUpdate = async (data) => {
    const { applicationId, status } = data
    const { applications } = this.state
    const response = await apiService.createFieldUpdateComment(data)

    if (response) {
      each(applications, (app, index) => {
        if (app.application_id === applicationId) {
          this.updateResults(`[${index}]['lease_up_status']`, status)
          this.updateResults(`[${index}]['status_updated']`, moment().format(SALESFORCE_DATE_FORMAT))
        }
      })

      this.updateStatusModal({
        applicationId: null,
        isOpen: false,
        loading: false,
        showAlert: false,
        status: null
      })
    } else {
      this.updateStatusModal({
        loading: false,
        showAlert: true,
        alertMsg: 'We were unable to make the update, please try again.',
        onAlertCloseClick: () => this.updateStatusModal({showAlert: false})
      })
    }
  }

  updateStatusModal = (values) => {
    this.setState(prevState => {
      return {
        statusModal: {
          ...clone(prevState.statusModal),
          ...values
        }
      }
    })
  }

  updateResults = (path, value) => {
    this.setState(prevState => {
      return {
        applications: set(clone(prevState.applications), path, value)
      }
    })
  }

  render () {
    const listing = this.props.listing

    const baseUrl = typeof SALESFORCE_BASE_URL !== 'undefined' ? SALESFORCE_BASE_URL : ''

    const exportButtonAction = {
      title: 'Export',
      link: `${baseUrl}/${listing.report_id}?csv=1`
    }

    const preferences = map(listing.listing_lottery_preferences, (pref) => pref.lottery_preference.name)

    const pageHeader = {
      title: listing.name,
      content: listing.building_street_address,
      action: listing.report_id ? exportButtonAction : null,
      breadcrumbs: [
        {title: 'Lease Ups', link: appPaths.toLeaseUps()},
        {title: listing.name, link: appPaths.toLeaseUpApplications(listing.id)}
      ]
    }

    const context = {
      applications: this.state.applications,
      listing: listing,
      preferences: preferences,
      handleOnFetchData: this.handleOnFetchData,
      handleCreateStatusUpdate: this.handleCreateStatusUpdate,
      handleOnFilter: this.handleOnFilter,
      loading: this.state.loading,
      pages: this.state.pages,
      rowsPerPage: ROWS_PER_PAGE,
      updateStatusModal: this.updateStatusModal,
      statusModal: this.state.statusModal,
      atMaxPages: this.state.atMaxPages
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
