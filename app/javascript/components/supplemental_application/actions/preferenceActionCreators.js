import { updatePreference } from 'components/supplemental_application/utils/supplementalRequestUtils'
import ACTIONS from 'context/actions'

/**
 * Returns a promise that resolves to true if the save was successful, false otherwise.
 * @param {Function} dispatch - Redux dispatch function
 * @param {number} preferenceIndexToUpdate - Index of the preference to update
 * @param {number} preferenceIndexToClose - Index of the preference row to close
 * @param {Object} formApplicationValues - The form application values
 * @param {Object} options - Optional configuration
 * @param {Function} options.onSuccess - Callback to run after successful update (e.g., cache invalidation)
 */

export const updateSavedPreference = async (
  dispatch,
  preferenceIndexToUpdate,
  preferenceIndexToClose,
  formApplicationValues,
  options = {}
) => {
  dispatch({ type: ACTIONS.SUPP_APP_LOAD_START })

  return updatePreference(preferenceIndexToUpdate, formApplicationValues)
    .then(() => {
      dispatch({
        type: ACTIONS.SUPP_APP_LOAD_SUCCESS,
        data: {
          application: formApplicationValues,
          confirmedPreferencesFailed: false
        }
      })

      preferenceSaveSuccess(dispatch, preferenceIndexToClose)

      // Call onSuccess callback if provided (for cache invalidation)
      if (options.onSuccess) {
        options.onSuccess()
      }

      return true
    })
    .catch(() => {
      dispatch({ type: ACTIONS.CONFIRMED_PREFERENCES_FAILED, data: { failed: true } })
      return false
    })
    .finally(() => dispatch({ type: ACTIONS.SUPP_APP_LOAD_COMPLETE }))
}

/**
 * @param {*} preferenceIndex the index of the preference on the application. Note that this is not necessarily
 *   the UI table index, since the table in the UI is sorted and filtered. If not provided, act as if all
 *   preferences were saved.
 */
export const preferenceSaveSuccess = async (dispatch, preferenceIndex = null) =>
  preferenceRowClosed(dispatch, preferenceIndex)

export const preferenceAlertCloseClicked = async (dispatch) =>
  dispatch({ type: ACTIONS.CONFIRMED_PREFERENCES_FAILED, data: { failed: false } })

export const editPreferenceClicked = async (dispatch, index) =>
  dispatch({ type: ACTIONS.PREF_TABLE_ROW_OPENED, data: { rowIndex: index } })

/**
 * @param {*} index the index of the preference that was closed, if null, close all rows
 */
export const preferenceRowClosed = async (dispatch, index) => {
  dispatch({ type: ACTIONS.PREF_TABLE_ROW_CLOSED, data: { rowIndex: index } })
  dispatch({ type: ACTIONS.CONFIRMED_PREFERENCES_FAILED, data: { failed: false } })
}
