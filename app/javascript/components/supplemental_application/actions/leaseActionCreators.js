import {
  logErrorAndAlert,
  wrapAsync
} from 'components/supplemental_application/actions/supplementalActionUtils'
import LEASE_STATES, {
  getInitialLeaseState
} from 'components/supplemental_application/utils/leaseSectionStates'
import {
  deleteLease,
  saveLeaseAndAssistances
} from 'components/supplemental_application/utils/supplementalRequestUtils'
import ACTIONS from 'context/actions'

export const leaseCreated = (dispatch) =>
  dispatch({ type: ACTIONS.LEASE_SECTION_STATE_CHANGED, data: LEASE_STATES.EDIT_LEASE })

export const leaseEditClicked = (dispatch) =>
  dispatch({ type: ACTIONS.LEASE_SECTION_STATE_CHANGED, data: LEASE_STATES.EDIT_LEASE })

export const leaseCanceled = (dispatch, application) =>
  dispatch({ type: ACTIONS.LEASE_SECTION_STATE_CHANGED, data: getInitialLeaseState(application) })

/**
 * Update lease and rental assistances for an application.
 * @param {Function} dispatch - Redux dispatch function
 * @param {Object} formApplication - The form application data
 * @param {Object} prevApplication - The previous application data
 * @param {Object} options - Optional configuration
 * @param {Function} options.onSuccess - Callback to run after successful update (e.g., cache invalidation)
 */
export const updateLease = (dispatch, formApplication, prevApplication, options = {}) =>
  wrapAsync(
    dispatch,
    () => saveLeaseAndAssistances(formApplication, prevApplication).catch(logErrorAndAlert),
    ({ lease, rentalAssistances }) => {
      // Call onSuccess callback if provided (for cache invalidation)
      if (options.onSuccess) {
        options.onSuccess()
      }
      return {
        type: ACTIONS.LEASE_AND_ASSISTANCES_UPDATED,
        data: {
          lease,
          rentalAssistances,
          newLeaseSectionState: LEASE_STATES.SHOW_LEASE
        }
      }
    }
  )

/**
 * Delete a lease for an application.
 * @param {Function} dispatch - Redux dispatch function
 * @param {Object} prevApplication - The previous application data
 * @param {Object} options - Optional configuration
 * @param {Function} options.onSuccess - Callback to run after successful delete (e.g., cache invalidation)
 */
export const deleteLeaseClicked = (dispatch, prevApplication, options = {}) =>
  wrapAsync(
    dispatch,
    () => deleteLease(prevApplication).catch(logErrorAndAlert),
    () => {
      // Call onSuccess callback if provided (for cache invalidation)
      if (options.onSuccess) {
        options.onSuccess()
      }
      return { type: ACTIONS.LEASE_DELETED }
    }
  )
