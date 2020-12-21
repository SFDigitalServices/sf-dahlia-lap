/* global SALESFORCE_BASE_URL */

import React, { useContext } from 'react'

import { map } from 'lodash'
import moment from 'moment'
import { useParams } from 'react-router-dom'

import { AppContext } from 'context/Provider'
import appPaths from 'utils/appPaths'
import {
  useAsync,
  useAsyncOnMount,
  useStateObject,
  useEffectOnMount,
  useIsMountedRef
} from 'utils/customHooks'
import { EagerPagination, SERVER_PAGE_SIZE } from 'utils/EagerPagination'
import { SALESFORCE_DATE_FORMAT } from 'utils/utils'

import TableLayout from '../layouts/TableLayout'
import { createFieldUpdateComment } from '../supplemental_application/actions'
import Context from './context'
import { getApplications, getListing } from './leaseUpActions'
import LeaseUpApplicationsTableContainer from './LeaseUpApplicationsTableContainer'

const ROWS_PER_PAGE = 20

const getPageHeaderData = (listing, reportId) => {
  const baseUrl = typeof SALESFORCE_BASE_URL !== 'undefined' ? SALESFORCE_BASE_URL : ''
  const exportButtonAction = reportId
    ? {
        title: 'Export',
        link: `${baseUrl}/${reportId}?csv=1`
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

  const breadcrumbs = [
    levelAboveBreadcrumb,
    listing.name
      ? {
          title: listing.name,
          link: appPaths.toLeaseUpApplications(listing.id),
          renderAsRouterLink: true
        }
      : emptyBreadCrumb
  ]

  return {
    title: listing?.name || <span>&nbsp;</span>,
    content: listing?.buildingAddress || '',
    action: exportButtonAction,
    breadcrumbs
  }
}

const getPreferences = (listing) => {
  if (!listing) return []
  return map(listing.listing_lottery_preferences, (pref) => pref.lottery_preference.name)
}

const LeaseUpApplicationsPage = () => {
  const [{ breadcrumbData, applicationsListData }, actions] = useContext(AppContext)

  // grab the listing id from the url: /lease-ups/listings/:listingId
  const { listingId } = useParams()

  const [state, setState] = useStateObject({
    loading: false,
    applications: [],
    pages: 0,
    atMaxPages: false,
    eagerPagination: new EagerPagination(ROWS_PER_PAGE, SERVER_PAGE_SIZE)
  })

  const [bulkCheckboxesState, setBulkCheckboxesState] = useStateObject({})
  const [statusModalState, setStatusModalState] = useStateObject({
    alertMsg: null,
    isCommentModal: false,
    isBulkUpdate: false,
    isOpen: false,
    loading: false,
    onSubmit: null,
    showAlert: null,
    applicationsData: null
  })

  const isMountedRef = useIsMountedRef()

  const [{ reportId, listingPreferences }, setListingState] = useStateObject({})
  useAsyncOnMount(() => getListing(listingId), {
    onSuccess: (listing) => {
      setListingState({
        reportId: listing.report_id,
        listingPreferences: getPreferences(listing)
      })

      actions.applicationsPageLoadComplete(listing)
    }
  })

  useAsync(
    () => {
      const { appliedFilters, page } = applicationsListData

      if (state.eagerPagination.isOverLimit(page)) {
        setState({
          applications: [],
          atMaxPage: true,
          loading: false
        })

        // don't trigger any promise if we're over the limit.
        return null
      }

      const fetcher = (p) => getApplications(listingId, p, appliedFilters)

      setState({ loading: true })

      return state.eagerPagination.getPage(page, fetcher)
    },
    {
      onSuccess: ({ records, pages }) => {
        setInitialCheckboxState(records)
        setState({ applications: records, pages })
      },
      onComplete: () => {
        setState({ loading: false })
      }
    },
    [applicationsListData.appliedFilters, applicationsListData.page]
  )

  useEffectOnMount(actions.applicationsPageMounted)

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
    setBulkCheckboxesState({ [appId]: !bulkCheckboxesState[appId] })
  }

  const handleOnFilter = (filters) => {
    state.eagerPagination.reset()
    actions.applicationsTableFiltersApplied(filters)
  }

  const handleStatusModalSubmit = async (submittedValues) => {
    setStatusModalState({ loading: true })
    const { applicationsData } = statusModalState
    const { status, subStatus } = submittedValues

    Object.keys(applicationsData).forEach((appId) => {
      applicationsData[appId].comment = submittedValues.comment?.trim()
      if (status) {
        applicationsData[appId].status = status
        applicationsData[appId].subStatus = subStatus
      }
    })

    createStatusUpdates(applicationsData)
  }

  const createStatusUpdates = async (applicationsData) => {
    const statusUpdateRequests = Object.keys(applicationsData).map((applicationId) => {
      const { status, comment, subStatus } = applicationsData[applicationId]
      return createFieldUpdateComment(applicationId, status, comment, subStatus)
        .then((_) => ({ application: applicationId }))
        .catch((e) => ({
          error: true,
          application: applicationId
        }))
    })

    return Promise.all(statusUpdateRequests).then((values) => {
      if (!isMountedRef.current) {
        return
      }

      const successfulIds = values.filter((v) => !v.error).map((v) => v.application)
      const errorIds = values.filter((v) => v.error).map((v) => v.application)
      const successfulData = {}

      successfulIds.forEach((applicationId) => {
        successfulData[applicationId] = applicationsData[applicationId]
        delete applicationsData[applicationId]
      })

      updateApplicationState(successfulData)

      const wasBulkUpdate = statusModalState.isBulkUpdate

      if (errorIds.length !== 0) {
        setStatusModalState({
          applicationsData: applicationsData,
          loading: false,
          showAlert: true,
          alertMsg: `We were unable to make the update for ${errorIds.length} out of ${values.length} applications, please try again.`,
          onAlertCloseClick: () => setStatusModalState({ showAlert: false })
        })
      } else {
        setStatusModalState({
          applicationsData: {},
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
    setStatusModalState({
      isOpen: false,
      showAlert: false,
      applicationsData: {}
    })
  }
  const handleLeaseUpStatusChange = (value, applicationId, isCommentModal) => {
    const isBulkUpdate = !applicationId
    const appsToUpdate = isBulkUpdate
      ? Object.entries(bulkCheckboxesState)
          .filter(([_, checked]) => checked)
          .map(([id, _]) => id)
      : [applicationId]

    const applicationsData = state.applications
      .filter(
        (application, position, self) =>
          appsToUpdate.includes(application.application_id) &&
          self.indexOf(application) === position
      )
      .reduce((obj, application) => {
        obj[application.application_id] = {
          application: application.application_id,
          status: value || application.lease_up_status,
          ...(!value && { sub_status: application.sub_status })
        }
        return obj
      }, {})

    setStatusModalState({
      isBulkUpdate,
      isCommentModal: isCommentModal,
      isOpen: true,
      status: value,
      applicationsData: applicationsData
    })
  }

  // Updated the visible status, substatus, and status last updated for one or many applications
  const updateApplicationState = (applicationsData) => {
    const updatedApplications = state.applications.map((app) => {
      const updatedApp = applicationsData[app.application_id]
      return {
        ...app,
        ...(updatedApp && {
          lease_up_status: updatedApp.status,
          status_last_updated: moment().format(SALESFORCE_DATE_FORMAT),
          sub_status: updatedApp.subStatus
        })
      }
    })
    setState({
      applications: updatedApplications
    })
  }

  const setBulkCheckboxValues = (newValue, applicationIds = null) => {
    const newBulkCheckboxState = {}
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
    onFilter: handleOnFilter,
    onLeaseUpStatusChange: handleLeaseUpStatusChange,
    onSubmitStatusModal: handleStatusModalSubmit,
    onClearSelectedApplications: handleClearSelectedApplications,
    onSelectAllApplications: handleSelectAllApplications,
    pages: state.pages,
    preferences: listingPreferences,
    rowsPerPage: ROWS_PER_PAGE,
    statusModal: statusModalState
  }

  return (
    <Context.Provider value={context}>
      <TableLayout pageHeader={getPageHeaderData(breadcrumbData.listing, reportId)}>
        <LeaseUpApplicationsTableContainer />
      </TableLayout>
    </Context.Provider>
  )
}

export default LeaseUpApplicationsPage
