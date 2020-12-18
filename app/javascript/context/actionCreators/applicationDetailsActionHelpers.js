import { cloneDeep, uniqBy } from 'lodash'

import {
  getSupplementalPageData,
  updateApplication,
  updateApplicationAndAddComment,
  updatePreference,
  updateTotalHouseholdRent
} from 'components/supplemental_application/actions'
import ACTIONS from 'context/actions'
import { doesApplicationHaveLease } from 'utils/leaseUtils'

import { getApplicationDetailsBreadcrumbsData } from './breadcrumbActionHelpers'

export const SHOW_LEASE_STATE = 'show_lease'
export const NO_LEASE_STATE = 'no_lease'
export const EDIT_LEASE_STATE = 'edit_lease'

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

export const getInitialLeaseState = (application) =>
  doesApplicationHaveLease(application) ? SHOW_LEASE_STATE : NO_LEASE_STATE

const shouldSaveLeaseOnApplicationSave = (leaseState) => leaseState === EDIT_LEASE_STATE

const getListingAmiCharts = (units) =>
  uniqBy(units, (u) => [u.ami_chart_type, u.ami_chart_year].join())

export const loadSupplementalApplicationPage = async (
  dispatch,
  applicationId,
  listingId = null
) => {
  dispatch({ type: ACTIONS.SUPP_APP_LOAD_START })
  return getSupplementalPageData(applicationId, listingId)
    .then(({ application, statusHistory, fileBaseUrl, units, listing }) => {
      dispatch({
        type: ACTIONS.SUPP_APP_LOAD_SUCCESS,
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
      })
    })
    .finally(() => dispatch({ type: ACTIONS.SUPP_APP_LOAD_COMPLETE }))
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
    supplementalAppTouched: false,
    leaseSectionState: leaveEditMode(prevLeaseSectionState),
    ...additionalFieldsToUpdate
  }
}

export const updateSupplementalApplication = async (
  dispatch,
  leaseSectionState,
  formApplication,
  prevApplication
) => {
  dispatch({ type: ACTIONS.SUPP_APP_LOAD_START })
  return updateApplication(
    formApplication,
    prevApplication,
    shouldSaveLeaseOnApplicationSave(leaseSectionState)
  )
    .then((responseApplication) => {
      dispatch({
        type: ACTIONS.SUPP_APP_LOAD_SUCCESS,
        data: {
          pageData: getApplicationStateOverridesAfterUpdate(leaseSectionState, responseApplication)
        }
      })
    })
    .finally(() => dispatch({ type: ACTIONS.SUPP_APP_LOAD_COMPLETE }))
}

export const updateSavedPreference = async (dispatch, preferenceIndex, formApplicationValues) => {
  dispatch({ type: ACTIONS.SUPP_APP_LOAD_START })
  const preference = formApplicationValues.preferences[preferenceIndex]
  const updates = [updatePreference(preference)]
  // If updating a rent burdened preference, we need to independently
  // update the rent on the application.
  if (preference.individual_preference === 'Rent Burdened') {
    updates.push(
      updateTotalHouseholdRent(formApplicationValues.id, formApplicationValues.total_monthly_rent)
    )
  }

  const responses = await Promise.all(updates)
  const failed = responses.some((r) => r === false)

  dispatch({
    type: ACTIONS.SUPP_APP_LOAD_SUCCESS,
    data: {
      pageData: {
        application: formApplicationValues,
        confirmedPreferencesFailed: false
      }
    }
  })

  if (failed) {
    dispatch({ type: ACTIONS.CONFIRMED_PREFERENCES_FAILED, data: { failed: true } })
  }

  return !failed
}

export const statusModalSubmit = async (
  dispatch,
  submittedValues,
  formApplication,
  prevApplication,
  leaseSectionState
) => {
  const { status, subStatus, comment } = submittedValues
  dispatch({
    type: ACTIONS.SUPP_APP_LOAD_START,
    data: {
      additionalOverrides: {
        statusModal: { loading: true }
      }
    }
  })

  const appWithNewStatus = { ...formApplication, status: formApplication.processing_status }

  return updateApplicationAndAddComment(
    appWithNewStatus,
    prevApplication,
    status,
    comment,
    subStatus,
    shouldSaveLeaseOnApplicationSave(leaseSectionState)
  )
    .then(({ application, statusHistory }) => {
      getApplicationStateOverridesAfterUpdate(application, { statusHistory })

      dispatch({
        type: ACTIONS.SUPP_APP_LOAD_SUCCESS,
        data: {
          pageData: {
            ...getApplicationStateOverridesAfterUpdate(application, { statusHistory }),
            statusModal: { isOpen: false }
          }
        }
      })
    })
    .catch((_) => {
      dispatch({
        type: ACTIONS.SUPP_APP_LOAD_FAIL,
        data: {
          additionalOverrides: {
            loading: false,
            showAlert: true,
            alertMsg: 'We were unable to make the update, please try again.'
          }
        }
      })
    })
    .finally(() => {
      dispatch({
        type: ACTIONS.SUPP_APP_LOAD_COMPLETE,
        data: { additionalOverrides: { statusModal: { loading: false } } }
      })
    })
}
