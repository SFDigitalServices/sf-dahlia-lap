import {
  getApplicationStateOverridesAfterUpdate,
  shouldSaveLeaseOnApplicationSave,
  wrapAsync
} from 'components/supplemental_application/actions/supplementalActionUtils'
import { updateApplicationAndAddComment } from 'components/supplemental_application/utils/supplementalRequestUtils'
import ACTIONS from 'context/actions'
import { getEmptyStatusModalState } from 'context/subreducers/SupplementalApplicationSubreducer'

export const openSuppAppAddCommentModal = (dispatch, statusHistory) => {
  const currentStatusItem = statusHistory?.[0]
  dispatch({
    type: ACTIONS.STATUS_MODAL_UPDATED,
    data: {
      ...getEmptyStatusModalState(),
      isInAddCommentMode: true,
      isOpen: true,
      ...(currentStatusItem && {
        status: currentStatusItem.status,
        substatus: currentStatusItem.substatus
      })
    }
  })
}

export const closeSuppAppStatusModal = (dispatch) =>
  dispatch({ type: ACTIONS.STATUS_MODAL_UPDATED, data: { isOpen: false } })

export const closeSuppAppStatusModalAlert = (dispatch) =>
  dispatch({ type: ACTIONS.STATUS_MODAL_UPDATED, data: { showAlert: false } })

export const openSuppAppUpdateStatusModal = (dispatch, newStatus) =>
  dispatch({
    type: ACTIONS.STATUS_MODAL_UPDATED,
    data: {
      ...getEmptyStatusModalState(),
      isInAddCommentMode: false,
      isOpen: true,
      status: newStatus
    }
  })

/**
 * Submit the status modal to update application status and add a comment.
 * @param {Function} dispatch - Redux dispatch function
 * @param {Object} submittedValues - The submitted form values (status, subStatus, comment)
 * @param {Object} formApplication - The form application data
 * @param {Object} prevApplication - The previous application data
 * @param {string} leaseSectionState - The current lease section state
 * @param {Object} options - Optional configuration
 * @param {Function} options.onSuccess - Callback to run after successful update (e.g., cache invalidation)
 */
export const submitSuppAppStatusModal = (
  dispatch,
  submittedValues,
  formApplication,
  prevApplication,
  leaseSectionState,
  options = {}
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
    ({ application, statusHistory }) => {
      // Call onSuccess callback if provided (for cache invalidation)
      if (options.onSuccess) {
        options.onSuccess()
      }
      return {
        type: ACTIONS.SUPP_APP_LOAD_SUCCESS,
        data: {
          ...getApplicationStateOverridesAfterUpdate(leaseSectionState, application, {
            statusHistory
          }),
          statusModal: { isOpen: false }
        }
      }
    },
    (_) => ({ type: ACTIONS.STATUS_MODAL_ERROR }),
    true
  )
}
