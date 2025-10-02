import ACTIONS from 'context/actions'
import { NEW_ASSISTANCE_PSEUDO_ID } from 'context/subreducers/SupplementalApplicationSubreducer'

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
