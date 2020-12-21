import { cloneDeep, uniqBy } from 'lodash'

import apiService from 'apiService'
import Alerts from 'components/Alerts'
import {
  deleteLease,
  saveLeaseAndAssistances,
  updateApplicationAndAddComment,
  updatePreference,
  updateTotalHouseholdRent,
  updateApplication,
  getSupplementalPageData
} from 'components/supplemental_application/actions'
import {
  EDIT_LEASE_STATE,
  NO_LEASE_STATE,
  SHOW_LEASE_STATE
} from 'context/actionCreators/application_details/leaseUiStates'
import { getApplicationDetailsBreadcrumbsData } from 'context/actionCreators/breadcrumbActionHelpers'
import ACTIONS from 'context/actions'
import { getEmptyStatusModalState } from 'context/subreducers/ApplicationDetailsSubreducer'
import formUtils from 'utils/formUtils'
import { doesApplicationHaveLease } from 'utils/leaseUtils'

const getListingAmiCharts = (units) =>
  uniqBy(units, (u) => [u.ami_chart_type, u.ami_chart_year].join())

const getInitialLeaseState = (application) =>
  doesApplicationHaveLease(application) ? SHOW_LEASE_STATE : NO_LEASE_STATE

const shouldSaveLeaseOnApplicationSave = (leaseState) => leaseState === EDIT_LEASE_STATE

const setApplicationsDefaults = (application) => {
  const applicationWithDefaults = cloneDeep(application)
  // Logic in Lease Section in order to show 'Select One' placeholder on Preference Used if a selection was never made
  if (
    applicationWithDefaults.lease &&
    !applicationWithDefaults.lease.no_preference_used &&
    applicationWithDefaults.lease.preference_used == null
  ) {
    delete applicationWithDefaults.lease.preference_used
  }
  return applicationWithDefaults
}

const getApplicationStateOverridesAfterUpdate = (
  prevLeaseSectionState,
  applicationResponse,
  additionalFieldsToUpdate = {}
) => {
  const leaveEditMode = (currentLeaseSectionState) =>
    currentLeaseSectionState === EDIT_LEASE_STATE ? SHOW_LEASE_STATE : currentLeaseSectionState

  return {
    application: setApplicationsDefaults(applicationResponse),
    loading: false,
    leaseSectionState: leaveEditMode(prevLeaseSectionState),
    ...additionalFieldsToUpdate
  }
}

const wrapAsync = async (
  dispatch,
  promiseFunc,
  getSuccessAction = () => {},
  getFailAction = () => {},
  alsoSetStatusModalLoading = false
) => {
  dispatch({
    type: ACTIONS.SUPP_APP_LOAD_START,
    data: alsoSetStatusModalLoading ? { statusModal: { loading: true } } : null
  })

  return promiseFunc()
    .then((response) => dispatch(getSuccessAction(response)))
    .catch((e) => dispatch(getFailAction(e)))
    .finally(() =>
      dispatch({
        type: ACTIONS.SUPP_APP_LOAD_COMPLETE,
        data: alsoSetStatusModalLoading ? { statusModal: { loading: false } } : null
      })
    )
}

export const loadSupplementalPageData = async (dispatch, applicationId, listingId = null) =>
  wrapAsync(
    dispatch,
    () => getSupplementalPageData(applicationId, listingId),
    ({ application, statusHistory, fileBaseUrl, units, listing }) => ({
      type: ACTIONS.SUPP_APP_INITIAL_LOAD_SUCCESS,
      data: {
        breadcrumbData: getApplicationDetailsBreadcrumbsData(application, listing),
        pageData: {
          application: setApplicationsDefaults(application),
          units,
          fileBaseUrl,
          // Only show lease section on load if there's a lease on the application.
          leaseSectionState: getInitialLeaseState(application),
          listing: listing,
          listingAmiCharts: getListingAmiCharts(units),
          rentalAssistances: application.rental_assistances,
          statusHistory
        }
      }
    }),
    (error) => {
      console.error(error)
      Alerts.error()
    }
  )

export const updateSupplementalApplication = async (
  dispatch,
  leaseSectionState,
  formApplication,
  prevApplication
) =>
  wrapAsync(
    dispatch,
    () =>
      updateApplication(
        formApplication,
        prevApplication,
        shouldSaveLeaseOnApplicationSave(leaseSectionState)
      ),
    (responseApplication) => ({
      type: ACTIONS.SUPP_APP_LOAD_SUCCESS,
      data: getApplicationStateOverridesAfterUpdate(leaseSectionState, responseApplication)
    }),
    (error) => {
      console.error(error)
      Alerts.error()
    }
  )

export const updateSavedPreference = async (dispatch, preferenceIndex, formApplicationValues) =>
  wrapAsync(dispatch, () => {
    const preference = formApplicationValues.preferences[preferenceIndex]
    const updates = [updatePreference(preference)]
    if (preference.individual_preference === 'Rent Burdened') {
      updates.push(
        updateTotalHouseholdRent(formApplicationValues.id, formApplicationValues.total_monthly_rent)
      )
    }

    return Promise.all(updates).then((responses) => {
      const failed = responses.some((r) => r === false)
      dispatch({
        type: ACTIONS.SUPP_APP_LOAD_SUCCESS,
        data: {
          application: formApplicationValues,
          confirmedPreferencesFailed: false
        }
      })

      if (failed) {
        dispatch({ type: ACTIONS.CONFIRMED_PREFERENCES_FAILED, data: { failed: true } })
      }

      return !failed
    })
  })

export const preferencesFailedChanged = (dispatch, failed) =>
  dispatch({ type: ACTIONS.CONFIRMED_PREFERENCES_FAILED, data: { failed } })

export const openSuppAppAddCommentModal = (dispatch, statusHistory) => {
  const currentStatusItem = statusHistory?.[0]
  dispatch({
    type: ACTIONS.STATUS_MODAL_UPDATED,
    data: {
      ...getEmptyStatusModalState(),
      header: 'Add New Comment',
      isOpen: true,
      status: currentStatusItem?.status,
      substatus: currentStatusItem?.substatus,
      submitButton: 'Save'
    }
  })
}

export const closeSuppAppStatusModal = (dispatch) =>
  dispatch({ type: ACTIONS.STATUS_MODAL_UPDATED, data: { isOpen: false } })

export const closeSuppAppStatusModalAlert = (dispatch) =>
  dispatch({ type: ACTIONS.STATUS_MODAL_UPDATED, data: { showAlert: false } })

export const leaseCreated = (dispatch) =>
  dispatch({ type: ACTIONS.LEASE_SECTION_STATE_CHANGED, data: EDIT_LEASE_STATE })

export const leaseEditClicked = (dispatch) =>
  dispatch({ type: ACTIONS.LEASE_SECTION_STATE_CHANGED, data: EDIT_LEASE_STATE })

export const leaseCanceled = (dispatch, application) =>
  dispatch({ type: ACTIONS.LEASE_SECTION_STATE_CHANGED, data: getInitialLeaseState(application) })

export const leaseSaved = (dispatch, formApplication, prevApplication) =>
  wrapAsync(
    dispatch,
    () =>
      saveLeaseAndAssistances(formApplication, prevApplication).catch((e) => {
        console.log(e)
        Alerts.error()
      }),
    ({ lease, rentalAssistances }) => ({
      type: ACTIONS.LEASE_AND_ASSISTANCES_UPDATED,
      data: {
        lease,
        rentalAssistances,
        newLeaseSectionState: SHOW_LEASE_STATE
      }
    })
  )

export const leaseDeleted = (dispatch, prevApplication) =>
  wrapAsync(
    dispatch,
    () =>
      deleteLease(prevApplication).catch((e) => {
        console.log(e)
        Alerts.error()
      }),
    () => ({ type: ACTIONS.LEASE_DELETED })
  )

export const createRentalAssistance = (dispatch, applicationId, rentalAssistance) =>
  wrapAsync(
    dispatch,
    () => apiService.createRentalAssistance(rentalAssistance, applicationId),
    ({ id }) => {
      const newRentalAssistance = {
        ...rentalAssistance,
        id,
        // show price in right format
        assistance_amount: formUtils.formatPrice(rentalAssistance.assistance_amount)
      }
      return {
        type: ACTIONS.RENTAL_ASSISTANCE_CREATE_SUCCESS,
        data: { newRentalAssistance }
      }
    }
  )

export const updateRentalAssistance = (dispatch, applicationId, updatedRentalAssistance) =>
  wrapAsync(
    dispatch,
    () => apiService.updateRentalAssistance(updatedRentalAssistance, applicationId),
    () => ({
      type: ACTIONS.RENTAL_ASSISTANCE_UPDATE_SUCCESS,
      data: {
        updatedRentalAssistance: {
          ...updatedRentalAssistance,
          // show price in right format
          assistance_amount: formUtils.formatPrice(updatedRentalAssistance.assistance_amount)
        }
      }
    })
  )

export const deleteRentalAssistance = async (dispatch, idToDelete) =>
  wrapAsync(
    dispatch,
    () => apiService.deleteRentalAssistance(idToDelete),
    (_) => ({
      type: ACTIONS.RENTAL_ASSISTANCE_DELETE_SUCCESS,
      data: { assistanceId: idToDelete }
    })
  )

export const openSuppAppUpdateStatusModal = (dispatch, newStatus) =>
  dispatch({
    type: ACTIONS.STATUS_MODAL_UPDATED,
    data: {
      ...getEmptyStatusModalState(),
      submitButton: 'Update',
      header: 'Update Status',
      isOpen: true,
      status: newStatus
    }
  })

export const submitSuppAppStatusModal = (
  dispatch,
  submittedValues,
  formApplication,
  prevApplication,
  leaseSectionState
) => {
  const { status, subStatus, comment } = submittedValues
  const appWithNewStatus = { ...formApplication, processing_status: status }
  return wrapAsync(
    dispatch,
    () => {
      return updateApplicationAndAddComment(
        appWithNewStatus,
        prevApplication,
        status,
        comment,
        subStatus,
        shouldSaveLeaseOnApplicationSave(leaseSectionState)
      )
    },
    ({ application, statusHistory }) => ({
      type: ACTIONS.SUPP_APP_LOAD_SUCCESS,
      data: {
        ...getApplicationStateOverridesAfterUpdate(leaseSectionState, application, {
          statusHistory
        }),
        statusModal: { isOpen: false }
      }
    }),
    (_) => ({ type: ACTIONS.STATUS_MODAL_ERROR }),
    true
  )
}

export const applicationPageLoadComplete = (
  dispatch,
  application,
  listing,
  fileBaseUrl,
  updateBreadcrumbs = false
) =>
  dispatch({
    type: ACTIONS.SHORTFORM_LOADED,
    data: {
      ...(updateBreadcrumbs && {
        breadcrumbData: getApplicationDetailsBreadcrumbsData(application, listing)
      }),
      pageData: {
        application,
        listing,
        fileBaseUrl
      }
    }
  })
