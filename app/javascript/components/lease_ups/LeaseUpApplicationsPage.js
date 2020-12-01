/* global SALESFORCE_BASE_URL */

import React, { useState } from 'react'

import { map } from 'lodash'
import moment from 'moment'
import { useParams } from 'react-router-dom'

import appPaths from 'utils/appPaths'
import { EagerPagination, SERVER_PAGE_SIZE } from 'utils/EagerPagination'
import { SALESFORCE_DATE_FORMAT } from 'utils/utils'

import TableLayout from '../layouts/TableLayout'
import { createFieldUpdateComment } from '../supplemental_application/actions'
import Context from './context'
import { getApplications, getListing } from './leaseUpActions'
import LeaseUpApplicationsTableContainer from './LeaseUpApplicationsTableContainer'

const ROWS_PER_PAGE = 20

const getPageHeaderData = (listing) => {
  const baseUrl = typeof SALESFORCE_BASE_URL !== 'undefined' ? SALESFORCE_BASE_URL : ''
  const exportButtonAction = listing?.report_id
    ? {
        title: 'Export',
        link: `${baseUrl}/${listing?.report_id}?csv=1`
      }
    : null

  const levelAboveBreadcrumb = {
    title: 'Lease Ups',
    link: appPaths.toLeaseUps(),
    renderAsRouterLink: true
  }

  const emptyBreadCrumb = {
    title: '',
    link: '#'
  }

  const breadcrumbs = listing
    ? [
        levelAboveBreadcrumb,
        {
          title: listing?.name,
          link: appPaths.toLeaseUpApplications(listing.id),
          renderAsRouterLink: true
        }
      ]
    : [levelAboveBreadcrumb, emptyBreadCrumb]

  return {
    title: listing?.name || '',
    content: listing?.building_street_address || '',
    action: exportButtonAction,
    breadcrumbs
  }
}

const getPreferences = (listing) => {
  if (!listing) return []
  return map(listing.listing_lottery_preferences, (pref) => pref.lottery_preference.name)
}

const LeaseUpApplicationsPage = () => {
  const [state, overrideEntireState] = useState({
    loading: false,
    applications: [],
    filters: {},
    page: 0,
    pages: 0,
    atMaxPages: false,
    listing: null,
    eagerPagination: new EagerPagination(ROWS_PER_PAGE, SERVER_PAGE_SIZE)
  })

  const [bulkCheckboxesState, setBulkCheckboxesState] = useState({})
  const [statusModalState, setStatusModalState] = useState({
    alertMsg: null,
    applicationIds: null,
    isBulkUpdate: false,
    isOpen: false,
    loading: false,
    onSubmit: null,
    showAlert: null,
    status: null,
    subStatus: null
  })

  // grab the listing id from the url: /lease-ups/listings/:listingId
  const { listingId } = useParams()

  const setInitialCheckboxState = (applications) => {
    // get unique applications
    const uniqAppIds = Array.from(new Set(applications.map((a) => a.application_id)))
    const emptyCheckboxes = uniqAppIds.reduce((a, b) => {
      a[b] = false
      return a
    }, {})
    // set state to false for all of the initial applications
    setBulkCheckboxesState(emptyCheckboxes)
  }

  const handleBulkCheckboxClick = (appId) => {
    setBulkCheckboxesState((prevState) => ({ ...prevState, [appId]: !bulkCheckboxesState[appId] }))
  }

  const updateStatusModal = (newState) => {
    setStatusModalState((prevState) => ({ ...prevState, ...newState }))
  }

  const setState = (newState) =>
    overrideEntireState((prevState) => ({
      ...prevState,
      ...newState
    }))

  const loadPage = async (page, filters) => {
    const { listing: listingFromState } = state

    const getStateOrFetchListing = () =>
      listingFromState ? Promise.resolve(listingFromState) : getListing(listingId)

    const fetcher = (p) => getApplications(listingId, p, filters)

    setState({ loading: true })

    Promise.all([getStateOrFetchListing(), state.eagerPagination.getPage(page, fetcher)])
      .then(([listing, { records, pages }]) => {
        setState({
          listing,
          applications: records,
          pages: pages,
          atMaxPages: false
        })
        setInitialCheckboxState(records)
      })
      .finally(() => {
        setState({ loading: false })
      })
  }

  const handleOnFetchData = ({ page }, _) => {
    if (state.eagerPagination.isOverLimit(page)) {
      setState({
        applications: [],
        loading: false,
        atMaxPages: true
      })
    } else {
      loadPage(page, state.filters)
    }
  }

  const handleOnFilter = (filters) => {
    setState({ filters })
    state.eagerPagination.reset()
    loadPage(0, filters)
  }

  const handleStatusModalSubmit = async (submittedValues) => {
    updateStatusModal({ loading: true })
    const { applicationIds } = statusModalState
    const { status, subStatus } = submittedValues
    const data = {
      applicationIds,
      status,
      comment: submittedValues.comment?.trim(),
      subStatus
    }

    createStatusUpdates(data)
  }

  const createStatusUpdates = async ({ applicationIds, comment, status, subStatus }) => {
    const statusUpdateRequests = applicationIds.map((appId) =>
      createFieldUpdateComment(appId, status, comment, subStatus)
        .then((_) => ({ application: appId }))
        .catch((e) => ({
          error: true,
          application: appId
        }))
    )

    return Promise.all(statusUpdateRequests).then((values) => {
      const successfulIds = values.filter((v) => !v.error).map((v) => v.application)
      const errorIds = values.filter((v) => v.error).map((v) => v.application)
      updateApplicationState(successfulIds, status, subStatus)

      const wasBulkUpdate = statusModalState.isBulkUpdate

      if (errorIds.length !== 0) {
        updateStatusModal({
          applicationIds: errorIds,
          loading: false,
          showAlert: true,
          alertMsg: `We were unable to make the update for ${errorIds.length} out of ${values.length} applications, please try again.`,
          onAlertCloseClick: () => updateStatusModal({ showAlert: false })
        })
      } else {
        updateStatusModal({
          applicationIds: [],
          isOpen: false,
          loading: false,
          showAlert: false,
          status: null
        })
      }

      if (wasBulkUpdate) {
        setBulkCheckboxValues(false, successfulIds)
      }
    })
  }

  const handleCloseStatusModal = () => {
    updateStatusModal({
      isOpen: false,
      showAlert: false,
      applicationIds: []
    })
  }
  const handleLeaseUpStatusChange = (value, applicationId) => {
    const isBulkUpdate = !applicationId
    const appsToUpdate = isBulkUpdate
      ? Object.entries(bulkCheckboxesState)
          .filter(([_, checked]) => checked)
          .map(([id, _]) => id)
      : [applicationId]

    updateStatusModal({
      applicationIds: appsToUpdate,
      isBulkUpdate,
      isOpen: true,
      status: value
    })
  }

  // Updated the visible status, substatus, and status last updated for one or many applications
  const updateApplicationState = (applicationIds, status, subStatus) => {
    const updatedApplications = state.applications.map((app) => ({
      ...app,
      ...(applicationIds.includes(app.application_id) && {
        lease_up_status: status,
        status_last_updated: moment().format(SALESFORCE_DATE_FORMAT),
        sub_status: subStatus
      })
    }))
    setState({
      applications: updatedApplications
    })
  }

  const setBulkCheckboxValues = (newValue, applicationIds = null) => {
    const newBulkCheckboxState = { ...bulkCheckboxesState }
    const applicationIdsToUpdate = applicationIds ?? Object.keys(bulkCheckboxesState)

    applicationIdsToUpdate.forEach((id) => (newBulkCheckboxState[id] = newValue))
    setBulkCheckboxesState(newBulkCheckboxState)
  }

  const handleClearSelectedApplications = () => setBulkCheckboxValues(false)
  const handleSelectAllApplications = () => setBulkCheckboxValues(true)

  const context = {
    applications: state.applications,
    atMaxPages: state.atMaxPages,
    bulkCheckboxesState: bulkCheckboxesState,
    listingId: listingId,
    loading: state.loading,
    onBulkCheckboxClick: handleBulkCheckboxClick,
    onCloseStatusModal: handleCloseStatusModal,
    onFetchData: handleOnFetchData,
    onFilter: handleOnFilter,
    onLeaseUpStatusChange: handleLeaseUpStatusChange,
    onSubmitStatusModal: handleStatusModalSubmit,
    onClearSelectedApplications: handleClearSelectedApplications,
    onSelectAllApplications: handleSelectAllApplications,
    pages: state.pages,
    preferences: getPreferences(state.listing),
    rowsPerPage: ROWS_PER_PAGE,
    statusModal: statusModalState
  }

  return (
    <Context.Provider value={context}>
      <TableLayout pageHeader={getPageHeaderData(state.listing)}>
        <LeaseUpApplicationsTableContainer />
      </TableLayout>
    </Context.Provider>
  )
}

export default LeaseUpApplicationsPage
