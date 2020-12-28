import { uniqBy } from 'lodash'

import { getSupplementalBreadcrumbData } from 'components/lease_ups/actions/breadcrumbActionHelpers'
import {
  getApplicationStateOverridesAfterUpdate,
  logErrorAndAlert,
  setApplicationDefaults,
  shouldSaveLeaseOnApplicationSave,
  wrapAsync
} from 'components/supplemental_application/actions/supplementalActionUtils'
import { getInitialLeaseState } from 'components/supplemental_application/utils/leaseSectionStates'
import {
  getSupplementalPageData,
  updateApplication,
  updatePreference
} from 'components/supplemental_application/utils/supplementalRequestUtils'
import ACTIONS from 'context/actions'

const getListingAmiCharts = (units) =>
  uniqBy(units, (u) => [u.ami_chart_type, u.ami_chart_year].join())

export const loadSupplementalPageData = async (dispatch, applicationId, listingId = null) =>
  wrapAsync(
    dispatch,
    () => getSupplementalPageData(applicationId, listingId),
    ({ application, statusHistory, fileBaseUrl, units, listing }) => ({
      type: ACTIONS.SUPP_APP_INITIAL_LOAD_SUCCESS,
      data: {
        breadcrumbData: getSupplementalBreadcrumbData(application, listing),
        pageData: {
          application: setApplicationDefaults(application),
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
    logErrorAndAlert
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
    logErrorAndAlert
  )

/**
 * Returns a promise that resolves to true if the save was successful, false otherwise.
 */
export const updateSavedPreference = async (dispatch, preferenceIndex, formApplicationValues) => {
  dispatch({ type: ACTIONS.SUPP_APP_LOAD_START })

  return updatePreference(preferenceIndex, formApplicationValues)
    .then(() => {
      dispatch({
        type: ACTIONS.SUPP_APP_LOAD_SUCCESS,
        data: {
          application: formApplicationValues,
          confirmedPreferencesFailed: false
        }
      })
      return true
    })
    .catch(() => {
      dispatch({ type: ACTIONS.CONFIRMED_PREFERENCES_FAILED, data: { failed: true } })
      return false
    })
    .finally(() => dispatch({ type: ACTIONS.SUPP_APP_LOAD_COMPLETE }))
}

export const preferencesFailedChanged = (dispatch, failed) =>
  dispatch({ type: ACTIONS.CONFIRMED_PREFERENCES_FAILED, data: { failed } })
