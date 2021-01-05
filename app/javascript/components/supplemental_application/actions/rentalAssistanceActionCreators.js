import apiService from 'apiService'
import { wrapAsync } from 'components/supplemental_application/actions/supplementalActionUtils'
import ACTIONS from 'context/actions'
import { NEW_ASSISTANCE_PSEUDO_ID } from 'context/subreducers/SupplementalApplicationSubreducer'
import formUtils from 'utils/formUtils'

export const createRentalAssistance = (dispatch, applicationId, rentalAssistance) =>
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
      return {
        type: ACTIONS.RENTAL_ASSISTANCE_CREATE_SUCCESS,
        data: { newRentalAssistance }
      }
    }
  )

export const updateRentalAssistance = (dispatch, applicationId, updatedRentalAssistance) =>
  wrapAsync(
    dispatch,
    () => apiService.updateRentalAssistance(updatedRentalAssistance, applicationId),
    () => ({
      type: ACTIONS.RENTAL_ASSISTANCE_UPDATE_SUCCESS,
      data: {
        updatedRentalAssistance: {
          ...updatedRentalAssistance,
          // show price in right format
          assistance_amount: formUtils.formatPrice(updatedRentalAssistance.assistance_amount)
        }
      }
    })
  )

export const deleteRentalAssistance = async (dispatch, idToDelete) =>
  wrapAsync(
    dispatch,
    () => apiService.deleteRentalAssistance(idToDelete),
    (_) => ({
      type: ACTIONS.RENTAL_ASSISTANCE_DELETE_SUCCESS,
      data: { assistanceId: idToDelete }
    })
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
