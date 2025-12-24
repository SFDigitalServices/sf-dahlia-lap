/* global SALESFORCE_BASE_URL */

import React, { useEffect, useRef } from 'react'

import { find, map, isEqual } from 'lodash'
import { useParams, useSearchParams, useLocation } from 'react-router-dom'

import {
  applicationsPageLoadComplete,
  applicationsPageMounted,
  applicationsTableFiltersApplied
} from 'components/lease_ups/actions/actionCreators'
import { LEASE_UP_APPLICATION_FILTERS } from 'components/lease_ups/applicationFiltersConsts'
import {
  useLeaseUpListing,
  useLeaseUpApplications,
  useUpdateApplicationStatus,
  useBulkUpdateApplicationStatus
} from 'query/hooks'
import appPaths from 'utils/appPaths'
import { useStateObject, useEffectOnMount, useAppContext } from 'utils/customHooks'
import { LEASE_UP_SUBSTATUS_OPTIONS } from 'utils/statusUtils'

import Context from './context'
import LeaseUpApplicationsTableContainer from './LeaseUpApplicationsTableContainer'
import TableLayout from '../layouts/TableLayout'

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

const LeaseUpApplicationsPage = () => {
  const [{ breadcrumbData, applicationsListData }, dispatch] = useAppContext()

  const [searchParams] = useSearchParams()
  const location = useLocation()

  // grab the listing id from the url: /lease-ups/listings/:listingId
  const { listingId } = useParams()

  const [pageState, setPageState] = useStateObject({
    showPageInfo: false,
    // Local applications state for optimistic updates
    localApplications: null
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

  const isSingleUpdateRef = useRef(false)

  // Mutation hooks for status updates
  const updateStatusMutation = useUpdateApplicationStatus(listingId)
  const bulkUpdateStatusMutation = useBulkUpdateApplicationStatus(listingId)

  // Fetch listing data using TanStack Query
  const {
    data: listing,
    isLoading: isListingLoading,
    isFetching: isListingFetching
  } = useLeaseUpListing(listingId)

  // Derive listing-related state from query data
  const reportId = listing?.report_id
  const listingPreferences = listing?.listing_lottery_preferences
    ? map(listing.listing_lottery_preferences, (pref) => pref.lottery_preference.name)
    : []
  const listingType = listing?.listing_type

  // Update breadcrumb state when listing data loads
  useEffect(() => {
    if (listing) {
      applicationsPageLoadComplete(dispatch, listing)
    }
  }, [listing, dispatch])

  // Sync URL filters with context state
  useEffect(() => {
    const urlFilters = {}
    const { appliedFilters } = applicationsListData

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
      applicationsTableFiltersApplied(dispatch, urlFilters)
    }
  }, [location, searchParams, dispatch, applicationsListData])

  // Fetch applications using TanStack Query
  const {
    displayRecords,
    totalPages,
    isLoading: isApplicationsLoading,
    isFetching: isApplicationsFetching
  } = useLeaseUpApplications(
    listingId,
    applicationsListData.page,
    applicationsListData.appliedFilters
  )

  // Use local applications state for optimistic updates, fall back to query data
  const applications = pageState.localApplications ?? displayRecords

  // Track previous page and filters to detect navigation changes
  const prevPageRef = useRef(applicationsListData.page)
  const prevFiltersRef = useRef(applicationsListData.appliedFilters)

  // Initialize checkbox state only when page or filters change (not on data updates)
  useEffect(() => {
    const pageChanged = prevPageRef.current !== applicationsListData.page
    const filtersChanged = !isEqual(prevFiltersRef.current, applicationsListData.appliedFilters)

    if (displayRecords && (pageChanged || filtersChanged)) {
      prevPageRef.current = applicationsListData.page
      prevFiltersRef.current = applicationsListData.appliedFilters
      setInitialCheckboxState(displayRecords)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayRecords, applicationsListData.page, applicationsListData.appliedFilters])

  // Initialize checkboxes on first load
  useEffect(() => {
    if (
      displayRecords &&
      displayRecords.length > 0 &&
      Object.keys(bulkCheckboxesState).length === 0
    ) {
      setInitialCheckboxState(displayRecords)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayRecords])

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
    applicationsTableFiltersApplied(dispatch, filters)
  }

  const handleStatusModalSubmit = async (submittedValues) => {
    setStatusModalState({ loading: true })
    const { applicationsData } = statusModalState
    const { status, subStatus } = submittedValues
    const isBulkUpdate = statusModalState.isBulkUpdate

    // Prepare the applications data with submitted values
    const updatedApplicationsData = {}
    Object.keys(applicationsData).forEach((appId) => {
      updatedApplicationsData[appId] = {
        ...applicationsData[appId],
        comment: submittedValues.comment?.trim()
      }

      // previous substatus might be a comment
      // clear it out if so
      if (
        !find(LEASE_UP_SUBSTATUS_OPTIONS[applicationsData[appId].status] || [], {
          value: applicationsData[appId].subStatus
        })
      ) {
        updatedApplicationsData[appId].subStatus = ''
      }

      if (status) {
        updatedApplicationsData[appId].status = status
        updatedApplicationsData[appId].subStatus = subStatus
      }
    })

    // Track if this is a single update for checkbox handling
    isSingleUpdateRef.current = !isBulkUpdate

    if (isBulkUpdate) {
      // Use bulk mutation for multiple applications
      bulkUpdateStatusMutation.mutate(
        { applicationsData: updatedApplicationsData },
        {
          onSuccess: () => {
            setStatusModalState({
              applicationsData: {},
              isOpen: false,
              loading: false,
              showAlert: false,
              status: null
            })
            // Clear checkboxes for successfully updated applications
            setBulkCheckboxValues(false, Object.keys(updatedApplicationsData))
          },
          onError: (error) => {
            // Handle partial failures
            const successfulIds = error.successes?.map((s) => s.applicationId) || []
            const failedCount =
              error.failures?.length || Object.keys(updatedApplicationsData).length
            const totalCount = Object.keys(updatedApplicationsData).length

            // Remove successful applications from the modal data
            const remainingData = {}
            Object.keys(updatedApplicationsData).forEach((appId) => {
              if (!successfulIds.includes(appId)) {
                remainingData[appId] = updatedApplicationsData[appId]
              }
            })

            setStatusModalState({
              applicationsData: remainingData,
              loading: false,
              showAlert: true,
              alertMsg: `We were unable to make the update for ${failedCount} out of ${totalCount} applications, please try again.`,
              onAlertCloseClick: () => setStatusModalState({ showAlert: false })
            })

            // Clear checkboxes for successfully updated applications
            if (successfulIds.length > 0) {
              setBulkCheckboxValues(false, successfulIds)
            }
          }
        }
      )
    } else {
      // Use single mutation for one application
      const applicationId = Object.keys(updatedApplicationsData)[0]
      const appData = updatedApplicationsData[applicationId]

      updateStatusMutation.mutate(
        {
          applicationId,
          status: appData.status,
          comment: appData.comment,
          substatus: appData.subStatus
        },
        {
          onSuccess: () => {
            setStatusModalState({
              applicationsData: {},
              isOpen: false,
              loading: false,
              showAlert: false,
              status: null
            })
          },
          onError: () => {
            setStatusModalState({
              applicationsData: updatedApplicationsData,
              loading: false,
              showAlert: true,
              alertMsg: 'We were unable to make the update, please try again.',
              onAlertCloseClick: () => setStatusModalState({ showAlert: false })
            })
          }
        }
      )
    }
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

    const applicationsDataObj = applications
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
      applicationsData: applicationsDataObj
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

  // Combined loading state: show loading on initial load only
  const loading = isListingLoading || isApplicationsLoading

  // Background fetching indicator (for subtle refresh indicator)
  const isFetching = isListingFetching || isApplicationsFetching

  const context = {
    applications,
    atMaxPages: false, // TanStack Query handles pagination limits
    bulkCheckboxesState,
    listingId,
    listingType,
    loading,
    isFetching,
    onBulkCheckboxClick: handleBulkCheckboxClick,
    onCloseStatusModal: handleCloseStatusModal,
    onFilter: handleOnFilter,
    onLeaseUpStatusChange: handleLeaseUpStatusChange,
    onSubmitStatusModal: handleStatusModalSubmit,
    onClearSelectedApplications: handleClearSelectedApplications,
    onSelectAllApplications: handleSelectAllApplications,
    pages: totalPages,
    preferences: listingPreferences,
    rowsPerPage: ROWS_PER_PAGE,
    statusModal: statusModalState,
    listing,
    setPageState,
    hasFilters: Object.keys(applicationsListData.appliedFilters).length > 0
  }

  const closePageAlert = () => {
    setPageState({ showPageInfo: false })
  }

  return (
    <Context.Provider value={context}>
      <TableLayout
        pageHeader={getPageHeaderData(breadcrumbData.listing, reportId)}
        info={{
          message: "We're sending your messages.  Refresh the page to see updates.",
          show: pageState.showPageInfo,
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
