/* global SALESFORCE_BASE_URL */

import React, { useState } from 'react'

import { map, set, clone } from 'lodash'
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
    isOpen: false,
    status: null,
    subStatus: null,
    applicationId: null,
    showAlert: null,
    loading: false
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

  const onBulkCheckboxClick = (appId) => {
    setBulkCheckboxesState({ ...bulkCheckboxesState, [appId]: !bulkCheckboxesState[appId] })
  }

  const updateStatusModal = (newState) => {
    setStatusModalState({ ...statusModalState, ...newState })
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

  const handleOnFetchData = ({ filters, page }, _) => {
    if (state.eagerPagination.isOverLimit(page)) {
      setState({
        applications: [],
        loading: false,
        atMaxPages: true
      })
    } else {
      loadPage(page, filters)
    }
  }

  const handleOnFilter = (filters) => {
    setState({ filters })
    state.eagerPagination.reset()
    loadPage(0, filters)
  }

  const handleBulkStatusUpdate = async ({ comment, status, subStatus }) => {
    const appsToUpdate = Object.keys(bulkCheckboxesState).filter((id) => bulkCheckboxesState[id])
    const statusUpdateRequests = appsToUpdate.map((appId) =>
      createFieldUpdateComment(appId, status, comment, subStatus)
    )
    Promise.all(statusUpdateRequests)
      .then(() => {
        bulkUpdateApplicationState(appsToUpdate, status, subStatus)
        updateStatusModal({
          applicationId: null,
          isOpen: false,
          loading: false,
          showAlert: false,
          status: null
        })
        setInitialCheckboxState(state.applications)
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
  const handleCreateStatusUpdate = async ({ applicationId, comment, status, subStatus }) => {
    handleBulkStatusUpdate([applicationId, status, comment, subStatus])
    createFieldUpdateComment(applicationId, status, comment, subStatus)
      .then((response) => {
        updateApplicationState(applicationId, status, subStatus)
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

  const updateApplicationState = (applicationId, status, subStatus) => {
    const index = state.applications.findIndex((app) => app.application_id === applicationId)

    const updatedApplication = {
      ...state.applications[index],
      ...{
        lease_up_status: status,
        status_last_updated: moment().format(SALESFORCE_DATE_FORMAT),
        substatus: subStatus
      }
    }
    overrideEntireState({
      ...state.applications,
      applications: set(clone(state.applications), `[${index}]`, updatedApplication)
    })
  }

  // Updated the visible status, substatus, and status last updated for many applications at once
  const bulkUpdateApplicationState = (applicationIds, status, subStatus) => {
    const updatedApplications = state.applications.map((app) =>
      applicationIds.includes(app.application_id)
        ? {
            ...app,
            ...{
              lease_up_status: status,
              status_last_updated: moment().format(SALESFORCE_DATE_FORMAT),
              substatus: subStatus
            }
          }
        : app
    )
    overrideEntireState({
      ...state,
      applications: updatedApplications
    })
  }

  const context = {
    applications: state.applications,
    listingId: listingId,
    preferences: getPreferences(state.listing),
    handleOnFetchData: handleOnFetchData,
    handleCreateStatusUpdate: handleCreateStatusUpdate,
    handleOnFilter: handleOnFilter,
    loading: state.loading,
    pages: state.pages,
    rowsPerPage: ROWS_PER_PAGE,
    updateStatusModal: updateStatusModal,
    statusModal: statusModalState,
    atMaxPages: state.atMaxPages,
    bulkCheckboxesState,
    onBulkCheckboxClick
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
