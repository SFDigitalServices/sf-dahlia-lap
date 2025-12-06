/* global SALESFORCE_BASE_URL */

import React from 'react'

import { map, isEqual } from 'lodash'
import moment from 'moment'
import { useParams, useSearchParams, useLocation } from 'react-router-dom'

import {
  applicationsPageLoadComplete,
  applicationsPageMounted,
  applicationsTableFiltersApplied
} from 'components/lease_ups/actions/actionCreators'
import { LEASE_UP_APPLICATION_FILTERS } from 'components/lease_ups/applicationFiltersConsts'
import appPaths from 'utils/appPaths'
import {
  useAsync,
  useAsyncOnMount,
  useStateObject,
  useEffectOnMount,
  useIsMountedRef,
  useAppContext
} from 'utils/customHooks'
import { GRAPHQL_SERVER_PAGE_SIZE, EagerPagination } from 'utils/EagerPagination'
import { SALESFORCE_DATE_FORMAT } from 'utils/utils'

import Context from './context'
import LeaseUpApplicationsTableContainer from './LeaseUpApplicationsTableContainer'
import { getApplicationsPagination, getListing } from './utils/leaseUpRequestUtils'
import TableLayout from '../layouts/TableLayout'
import { createFieldUpdateComment } from '../supplemental_application/utils/supplementalRequestUtils'

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
  if (!listing?.listing_lottery_preferences) return []
  return map(listing.listing_lottery_preferences, (pref) => pref.lottery_preference.name)
}

const LeaseUpApplicationsPage = () => {
  const [{ breadcrumbData, applicationsListData }, dispatch] = useAppContext()

  const [searchParams] = useSearchParams()
  const location = useLocation()

  // grab the listing id from the url: /lease-ups/listings/:listingId
  const { listingId } = useParams()

  const [state, setState] = useStateObject({
    loading: false,
    applications: [],
    pages: 0,
    atMaxPages: false,
    forceRefreshNextPageUpdate: false,
    eagerPagination: new EagerPagination(ROWS_PER_PAGE, GRAPHQL_SERVER_PAGE_SIZE, true),
    showPageInfo: false
  })

  const [bulkCheckboxesState, setBulkCheckboxesState, overrideBulkCheckboxesState] = useStateObject(
    {}
  )

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

  const [{ reportId, listingPreferences, listingType, listing }, setListingState] = useStateObject(
    {}
  )
  useAsyncOnMount(() => getListing(listingId), {
    onSuccess: (listing) => {
      setListingState({
        reportId: listing.report_id,
        listingPreferences: getPreferences(listing),
        listingType: listing.listing_type,
        listing
      })

      applicationsPageLoadComplete(dispatch, listing)
    }
  })

  useAsync(
    () => {
      const urlFilters = {}
      let { appliedFilters, page } = applicationsListData
      LEASE_UP_APPLICATION_FILTERS.forEach((filter) => {
        const values = searchParams.getAll(filter.fieldName)
        if (values.length > 0) {
          urlFilters[filter.fieldName] = values
        }
      })

      const textSearchFilters = searchParams.get('search')
      if (textSearchFilters) {
        urlFilters.search = textSearchFilters
      }

      if (!isEqual(appliedFilters, urlFilters)) {
        appliedFilters = urlFilters
        state.forceRefreshNextPageUpdate = true
        applicationsTableFiltersApplied(dispatch, appliedFilters)
      }

      if (state.eagerPagination.isOverLimit(page)) {
        setState({
          applications: [],
          atMaxPage: true,
          loading: false
        })

        // don't trigger any promise if we're over the limit.
        return null
      }

      const fetcher = (p) => getApplicationsPagination(listingId, p, appliedFilters)

      setState({ loading: true })

      return state.eagerPagination.getPage(page, fetcher, state.forceRefreshNextPageUpdate)
    },
    {
      onSuccess: ({ records, pages }) => {
        setInitialCheckboxState(records)
        setState({ forceRefreshNextPageUpdate: false, applications: records, pages })
      },
      onComplete: () => {
        setState({ loading: false })
      },
      onFail: (e) => {
        console.error(`An error was thrown while fetching applications`)
        console.trace(e)
      }
    },
    // Using location in the deps array allows us to run this effect:
    // on mount, if the user changes the url manually, or if the user hits the back button
    [location, applicationsListData.page, state.eagerPagination]
  )

  useEffectOnMount(() => applicationsPageMounted(dispatch))

  const setInitialCheckboxState = (applications) => {
    // get unique applications
    const uniqAppIds = Array.from(new Set(applications.map((a) => a.application_id)))
    const emptyCheckboxes = uniqAppIds.reduce((a, b) => {
      a[b] = false
      return a
    }, {})

    // set state to false for all of the initial applications
    // and clear out any application entries from a previous page.
    overrideBulkCheckboxesState(emptyCheckboxes)
  }

  const handleBulkCheckboxClick = (appId) => {
    setBulkCheckboxesState({ [appId]: !bulkCheckboxesState[appId] })
  }

  const handleOnFilter = (filters) => {
    state.eagerPagination.reset()
    applicationsTableFiltersApplied(dispatch, filters)
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
          applicationsData,
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

      // Force the next page update to refresh because changing the status on a preference row
      // on page 1 could update a preference row attached to the same application on page 2.
      setState({ forceRefreshNextPageUpdate: true })
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
          ...(!value && { subStatus: application.sub_status })
        }
        return obj
      }, {})

    setStatusModalState({
      isBulkUpdate,
      isCommentModal,
      isOpen: true,
      status: value,
      applicationsData
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
    bulkCheckboxesState,
    listingId,
    listingType,
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
    statusModal: statusModalState,
    listing,
    setPageState: setState,
    hasFilters: Object.keys(applicationsListData.appliedFilters).length > 0
  }

  const closePageAlert = () => {
    setState({ showPageInfo: false })
  }

  return (
    <Context.Provider value={context}>
      <TableLayout
        pageHeader={getPageHeaderData(breadcrumbData.listing, reportId)}
        info={{
          message: "We're sending your messages.  Refresh the page to see updates.",
          show: state.showPageInfo,
          onCloseClick: closePageAlert,
          icon: 'i-hour-glass'
        }}
      >
        <LeaseUpApplicationsTableContainer />
      </TableLayout>
    </Context.Provider>
  )
}

export default LeaseUpApplicationsPage
