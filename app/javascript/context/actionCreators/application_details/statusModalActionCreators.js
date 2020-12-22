import { updateApplicationAndAddComment } from 'components/supplemental_application/actions'
import {
  getApplicationStateOverridesAfterUpdate,
  shouldSaveLeaseOnApplicationSave,
  wrapAsync
} from 'context/actionCreators/application_details/utils'
import ACTIONS from 'context/actions'
import { getEmptyStatusModalState } from 'context/subreducers/ApplicationDetailsSubreducer'

export const openSuppAppAddCommentModal = (dispatch, statusHistory) => {
  const currentStatusItem = statusHistory?.[0]
  dispatch({
    type: ACTIONS.STATUS_MODAL_UPDATED,
    data: {
      ...getEmptyStatusModalState(),
      isInAddCommentMode: true,
      isOpen: true,
      status: currentStatusItem?.status,
      substatus: currentStatusItem?.substatus
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
