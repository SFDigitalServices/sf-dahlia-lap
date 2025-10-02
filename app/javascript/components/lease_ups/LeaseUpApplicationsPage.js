/* global SALESFORCE_BASE_URL */

import React, { useCallback, useEffect, useMemo } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { map, isEqual } from 'lodash'
import moment from 'moment'
import { useParams, useLocation } from 'react-router-dom'

import { createFieldUpdateComment } from 'apiService'
import {
  applicationsPageLoadComplete,
  applicationsPageMounted,
  applicationsTableFiltersApplied
} from 'components/lease_ups/actions/actionCreators'
import { LEASE_UP_APPLICATION_FILTERS } from 'components/lease_ups/applicationFiltersConsts'
import { invalidateLeaseUpRelatedQueries } from 'query/hooks/useLeaseUpMutations'
import { useLeaseUpListing, useLeaseUpApplications } from 'query/hooks/useLeaseUpQueries'
import appPaths from 'utils/appPaths'
import { LISTING_TYPE_FIRST_COME_FIRST_SERVED } from 'utils/consts'
import { useStateObject, useEffectOnMount, useIsMountedRef, useAppContext } from 'utils/customHooks'
import { MAX_SERVER_LIMIT } from 'utils/EagerPagination'
import { SALESFORCE_DATE_FORMAT } from 'utils/utils'

import Context from './context'
import { buildLeaseUpAppFirstComeFirstServedModel } from './leaseUpAppFirstComeFirstServedModel'
import LeaseUpApplicationsTableContainer from './LeaseUpApplicationsTableContainer'
import { buildLeaseUpAppPrefModel } from './leaseUpAppPrefModel'
import { sanitizeAndFormatSearch } from './utils/leaseUpRequestUtils'
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

const getPreferences = (listing) => {
  if (!listing?.listing_lottery_preferences) return []
  return map(listing.listing_lottery_preferences, (pref) => pref.lottery_preference.name)
}

const transformFcfsRecords = (records) =>
  map(records, buildLeaseUpAppFirstComeFirstServedModel).map((application, index) => ({
    ...application,
    index
  }))

const transformApplicationsResponse = (response) => {
  if (!response) return { records: [], pages: 0 }

  const { records = [], pages = 0, listing_type: listingType } = response
  const transformedRecords =
    listingType === LISTING_TYPE_FIRST_COME_FIRST_SERVED
      ? transformFcfsRecords(records)
      : map(records, buildLeaseUpAppPrefModel)

  return { records: transformedRecords, pages }
}

const LeaseUpApplicationsPage = () => {
  const queryClient = useQueryClient()
  const [{ breadcrumbData, applicationsListData }, dispatch] = useAppContext()

  const location = useLocation()

  // grab the listing id from the url: /lease-ups/listings/:listingId
  const { listingId } = useParams()

  const [state, setState] = useStateObject({
    applications: [],
    pages: 0
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

  const [{ reportId, listingPreferences, listingType }, setListingState] = useStateObject({})
  const urlFilters = useMemo(() => {
    const params = new URLSearchParams(location.search)
    const filters = {}

    LEASE_UP_APPLICATION_FILTERS.forEach((filter) => {
      const values = params.getAll(filter.fieldName)
      if (values.length > 0) {
        filters[filter.fieldName] = values
      }
    })

    const textSearchFilters = params.get('search')
    if (textSearchFilters) {
      filters.search = textSearchFilters
    }

    return filters
  }, [location.search])

  useEffect(() => {
    if (!isEqual(applicationsListData.appliedFilters, urlFilters)) {
      applicationsTableFiltersApplied(dispatch, urlFilters)
    }
  }, [urlFilters, applicationsListData.appliedFilters, dispatch])

  const queryFilters = useMemo(() => {
    if (!urlFilters.search) {
      return urlFilters
    }

    return {
      ...urlFilters,
      search: sanitizeAndFormatSearch(urlFilters.search)
    }
  }, [urlFilters])

  const isOverLimit = applicationsListData.page * ROWS_PER_PAGE >= MAX_SERVER_LIMIT

  const { data: listingData, isLoading: isListingLoading } = useLeaseUpListing(listingId)

  useEffect(() => {
    if (!listingData) return

    setListingState({
      reportId: listingData.report_id,
      listingPreferences: getPreferences(listingData),
      listingType: listingData.listing_type
    })

    applicationsPageLoadComplete(dispatch, listingData)
  }, [listingData, setListingState, dispatch])

  const {
    data: applicationsResponse,
    isLoading: isApplicationsLoading,
    isFetching: isApplicationsFetching,
    error: applicationsError
  } = useLeaseUpApplications(
    { listingId, page: applicationsListData.page, filters: queryFilters },
    {
      enabled: Boolean(listingId) && !isOverLimit,
      select: transformApplicationsResponse
    }
  )

  const setInitialCheckboxState = useCallback(
    (applications) => {
      // get unique applications
      const uniqAppIds = Array.from(new Set(applications.map((a) => a.application_id)))
      const emptyCheckboxes = uniqAppIds.reduce((a, b) => {
        a[b] = false
        return a
      }, {})

      // set state to false for all of the initial applications
      // and clear out any application entries from a previous page
      overrideBulkCheckboxesState(emptyCheckboxes)
    },
    [overrideBulkCheckboxesState]
  )

  useEffect(() => {
    if (!applicationsResponse) return

    setInitialCheckboxState(applicationsResponse.records)
    setState({ applications: applicationsResponse.records, pages: applicationsResponse.pages })
  }, [applicationsResponse, setState, setInitialCheckboxState])

  useEffect(() => {
    if (!applicationsError) return

    console.error('An error was thrown while fetching applications')
    console.trace(applicationsError)
  }, [applicationsError])

  useEffectOnMount(() => applicationsPageMounted(dispatch))

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

    const values = await Promise.all(statusUpdateRequests)

    if (!isMountedRef.current) {
      return values
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

    await invalidateLeaseUpRelatedQueries({
      queryClient,
      listingId
    })

    return values
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
    atMaxPages: isOverLimit,
    bulkCheckboxesState,
    listingId,
    listingType,
    loading: isListingLoading || isApplicationsLoading || isApplicationsFetching,
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
    hasFilters: Object.keys(applicationsListData.appliedFilters).length > 0
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
