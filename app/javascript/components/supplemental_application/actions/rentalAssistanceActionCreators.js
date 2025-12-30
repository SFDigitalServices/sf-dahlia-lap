import apiService from 'apiService'
import { wrapAsync } from 'components/supplemental_application/actions/supplementalActionUtils'
import ACTIONS from 'context/actions'
import { NEW_ASSISTANCE_PSEUDO_ID } from 'context/subreducers/SupplementalApplicationSubreducer'
import formUtils from 'utils/formUtils'

/**
 * Create a new rental assistance for an application.
 * @param {Function} dispatch - Redux dispatch function
 * @param {string} applicationId - The application ID
 * @param {Object} rentalAssistance - The rental assistance data
 * @param {Object} options - Optional configuration
 * @param {Function} options.onSuccess - Callback to run after successful create (e.g., cache invalidation)
 */
export const createRentalAssistance = (dispatch, applicationId, rentalAssistance, options = {}) =>
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
      // Call onSuccess callback if provided (for cache invalidation)
      if (options.onSuccess) {
        options.onSuccess()
      }
      return {
        type: ACTIONS.RENTAL_ASSISTANCE_CREATE_SUCCESS,
        data: { newRentalAssistance }
      }
    }
  )

/**
 * Update an existing rental assistance for an application.
 * @param {Function} dispatch - Redux dispatch function
 * @param {string} applicationId - The application ID
 * @param {Object} updatedRentalAssistance - The updated rental assistance data
 * @param {Object} options - Optional configuration
 * @param {Function} options.onSuccess - Callback to run after successful update (e.g., cache invalidation)
 */
export const updateRentalAssistance = (
  dispatch,
  applicationId,
  updatedRentalAssistance,
  options = {}
) =>
  wrapAsync(
    dispatch,
    () => apiService.updateRentalAssistance(updatedRentalAssistance, applicationId),
    () => {
      // Call onSuccess callback if provided (for cache invalidation)
      if (options.onSuccess) {
        options.onSuccess()
      }
      return {
        type: ACTIONS.RENTAL_ASSISTANCE_UPDATE_SUCCESS,
        data: {
          updatedRentalAssistance: {
            ...updatedRentalAssistance,
            // show price in right format
            assistance_amount: formUtils.formatPrice(updatedRentalAssistance.assistance_amount)
          }
        }
      }
    }
  )

/**
 * Delete a rental assistance.
 * @param {Function} dispatch - Redux dispatch function
 * @param {string} idToDelete - The rental assistance ID to delete
 * @param {Object} options - Optional configuration
 * @param {Function} options.onSuccess - Callback to run after successful delete (e.g., cache invalidation)
 */
export const deleteRentalAssistance = async (dispatch, idToDelete, options = {}) =>
  wrapAsync(
    dispatch,
    () => apiService.deleteRentalAssistance(idToDelete),
    (_) => {
      // Call onSuccess callback if provided (for cache invalidation)
      if (options.onSuccess) {
        options.onSuccess()
      }
      return {
        type: ACTIONS.RENTAL_ASSISTANCE_DELETE_SUCCESS,
        data: { assistanceId: idToDelete }
      }
    }
  )

export const cancelEditRentalAssistance = async (dispatch, id = null) =>
  dispatch({
    type: ACTIONS.ASSISTANCE_TABLE_ROW_CLOSED,
    data: { assistanceId: id ?? NEW_ASSISTANCE_PSEUDO_ID }
  })

export const editRentalAssistance = async (dispatch, id = null) =>
  dispatch({
    type: ACTIONS.ASSISTANCE_TABLE_ROW_OPENED,
    data: { assistanceId: id ?? NEW_ASSISTANCE_PSEUDO_ID }
  })
