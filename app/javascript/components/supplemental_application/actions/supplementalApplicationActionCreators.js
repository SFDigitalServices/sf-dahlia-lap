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
  updateApplication
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
          listing,
          listingAmiCharts: getListingAmiCharts(units),
          rentalAssistances: application.rental_assistances,
          statusHistory
        }
      }
    }),
    logErrorAndAlert
  )

/**
 * Update a supplemental application.
 * @param {Function} dispatch - Redux dispatch function
 * @param {string} leaseSectionState - The current lease section state
 * @param {Object} formApplication - The form application data
 * @param {Object} prevApplication - The previous application data
 * @param {Object} options - Optional configuration
 * @param {Function} options.onSuccess - Callback to run after successful update (e.g., cache invalidation)
 */
export const updateSupplementalApplication = async (
  dispatch,
  leaseSectionState,
  formApplication,
  prevApplication,
  options = {}
) =>
  wrapAsync(
    dispatch,
    () =>
      updateApplication(
        formApplication,
        prevApplication,
        shouldSaveLeaseOnApplicationSave(leaseSectionState)
      ),
    (responseApplication) => {
      // Call onSuccess callback if provided (for cache invalidation)
      if (options.onSuccess) {
        options.onSuccess()
      }
      return {
        type: ACTIONS.SUPP_APP_LOAD_SUCCESS,
        data: getApplicationStateOverridesAfterUpdate(leaseSectionState, responseApplication)
      }
    },
    logErrorAndAlert
  )
