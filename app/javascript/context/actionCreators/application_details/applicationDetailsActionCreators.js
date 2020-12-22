import { uniqBy } from 'lodash'

import {
  getSupplementalPageData,
  updateApplication,
  updatePreference,
  updateTotalHouseholdRent
} from 'components/supplemental_application/actions'
import { getInitialLeaseState } from 'context/actionCreators/application_details/leaseSectionStates'
import {
  getApplicationStateOverridesAfterUpdate,
  logErrorAndAlert,
  setApplicationDefaults,
  shouldSaveLeaseOnApplicationSave,
  wrapAsync
} from 'context/actionCreators/application_details/utils'
import { getApplicationDetailsBreadcrumbsData } from 'context/actionCreators/breadcrumbActionHelpers'
import ACTIONS from 'context/actions'

const getListingAmiCharts = (units) =>
  uniqBy(units, (u) => [u.ami_chart_type, u.ami_chart_year].join())

/*
 * Initial page loads
 */

export const loadSupplementalPageData = async (dispatch, applicationId, listingId = null) =>
  wrapAsync(
    dispatch,
    () => getSupplementalPageData(applicationId, listingId),
    ({ application, statusHistory, fileBaseUrl, units, listing }) => ({
      type: ACTIONS.SUPP_APP_INITIAL_LOAD_SUCCESS,
      data: {
        breadcrumbData: getApplicationDetailsBreadcrumbsData(application, listing),
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

export const applicationPageLoadComplete = (
  dispatch,
  application,
  fileBaseUrl,
  updateBreadcrumbs = false
) =>
  dispatch({
    type: ACTIONS.SHORTFORM_LOADED,
    data: {
      ...(updateBreadcrumbs && {
        breadcrumbData: getApplicationDetailsBreadcrumbsData(application, application?.listing)
      }),
      pageData: {
        application,
        listing: application?.listing,
        fileBaseUrl
      }
    }
  })

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
