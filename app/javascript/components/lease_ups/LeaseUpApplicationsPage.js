/* global SALESFORCE_BASE_URL */

import React, { useState } from 'react'
import { map, each, set, clone } from 'lodash'
import moment from 'moment'
import { getApplications } from './leaseUpActions'

import { createFieldUpdateComment } from '../supplemental_application/actions'
import LeaseUpApplicationsTableContainer from './LeaseUpApplicationsTableContainer'
import TableLayout from '../layouts/TableLayout'
import appPaths from '~/utils/appPaths'
import { EagerPagination, SERVER_PAGE_SIZE } from '~/utils/EagerPagination'
import Context from './context'
import { SALESFORCE_DATE_FORMAT } from '~/utils/utils'

const ROWS_PER_PAGE = 20
const BASE_URL = typeof SALESFORCE_BASE_URL !== 'undefined' ? SALESFORCE_BASE_URL : ''

const getPageHeaderData = (listing) => {
  const exportButtonAction = {
    title: 'Export',
    link: `${BASE_URL}/${listing.report_id}?csv=1`
  }

  return {
    title: listing.name,
    content: listing.building_street_address,
    action: listing.report_id ? exportButtonAction : null,
    breadcrumbs: [
      { title: 'Lease Ups', link: appPaths.toLeaseUps() },
      { title: listing.name, link: appPaths.toLeaseUpApplications(listing.id) }
    ]
  }
}

const getPreferences = (listing) =>
  map(listing.listing_lottery_preferences, (pref) => pref.lottery_preference.name)

const LeaseUpApplicationsPage = ({ listing }) => {
  const [state, overrideEntireState] = useState({
    loading: false,
    applications: [],
    pages: 0,
    atMaxPages: false,
    statusModal: {
      isOpen: false,
      status: null,
      subStatus: null,
      applicationId: null,
      showAlert: null,
      loading: false
    }
  })

  const setState = (newState) =>
    overrideEntireState((prevState) => ({
      ...prevState,
      ...newState
    }))

  const setStateWithPrev = (newState) =>
    overrideEntireState((prevState) => ({
      ...prevState,
      ...newState(prevState)
    }))

  const eagerPagination = new EagerPagination(ROWS_PER_PAGE, SERVER_PAGE_SIZE)

  const performAsyncRequest = (initialState, promiseFunc, stateFromResponse) => {
    setState({
      ...initialState,
      loading: true
    })

    promiseFunc()
      .then((r) => setState({ ...stateFromResponse(r) }))
      .finally(() => setState({ loading: false }))
  }

  const loadPage = async (page, filters) => {
    const fetcher = (p) => getApplications(listing.id, p, filters)
    performAsyncRequest(
      { page },
      () => eagerPagination.getPage(page, fetcher),
      ({ records, pages }) => ({
        applications: records,
        pages: pages,
        atMaxPages: false
      })
    )
  }

  const handleOnFetchData = (state, instance) => {
    const { filters } = state
    if (eagerPagination.isOverLimit(state.page)) {
      setState({
        applications: [],
        loading: false,
        atMaxPages: true
      })
    } else {
      loadPage(state.page, filters)
    }
  }

  const handleOnFilter = (filters) => {
    setState({ filters })
    eagerPagination.reset()
    loadPage(0, filters)
  }

  const handleCreateStatusUpdate = async (data) => {
    const { applicationId, comment, status, subStatus } = data
    const { applications } = state

    createFieldUpdateComment(applicationId, status, comment, subStatus)
      .then((response) => {
        each(applications, (app, index) => {
          if (app.application_id === applicationId) {
            updateResults(`[${index}]['lease_up_status']`, status)
            updateResults(`[${index}]['status_updated']`, moment().format(SALESFORCE_DATE_FORMAT))
          }
        })

        updateStatusModal({
          applicationId: null,
          isOpen: false,
          loading: false,
          showAlert: false,
          status: null
        })
      })
      .catch(() => {
        updateStatusModal({
          loading: false,
          showAlert: true,
          alertMsg: 'We were unable to make the update, please try again.',
          onAlertCloseClick: () => updateStatusModal({ showAlert: false })
        })
      })
  }

  const updateStatusModal = (values) => {
    setStateWithPrev((prevState) => ({
      statusModal: {
        ...clone(prevState.statusModal),
        ...values
      }
    }))
  }

  const updateResults = (path, value) => {
    setStateWithPrev((prevState) => ({
      applications: set(clone(prevState.applications), path, value)
    }))
  }

  const context = {
    applications: state.applications,
    listing: listing,
    preferences: getPreferences(listing),
    handleOnFetchData: handleOnFetchData,
    handleCreateStatusUpdate: handleCreateStatusUpdate,
    handleOnFilter: handleOnFilter,
    loading: state.loading,
    pages: state.pages,
    rowsPerPage: ROWS_PER_PAGE,
    updateStatusModal: updateStatusModal,
    statusModal: state.statusModal,
    atMaxPages: state.atMaxPages
  }

  return (
    <Context.Provider value={context}>
      <TableLayout pageHeader={getPageHeaderData(listing)}>
        <LeaseUpApplicationsTableContainer />
      </TableLayout>
    </Context.Provider>
  )
}

export default LeaseUpApplicationsPage
