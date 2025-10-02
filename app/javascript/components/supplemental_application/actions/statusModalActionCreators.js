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
