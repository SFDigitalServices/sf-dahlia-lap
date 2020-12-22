import { deleteLease, saveLeaseAndAssistances } from 'components/supplemental_application/actions'
import LEASE_STATES, {
  getInitialLeaseState
} from 'context/actionCreators/application_details/leaseSectionStates'
import { logErrorAndAlert, wrapAsync } from 'context/actionCreators/application_details/utils'
import ACTIONS from 'context/actions'

export const leaseCreated = (dispatch) =>
  dispatch({ type: ACTIONS.LEASE_SECTION_STATE_CHANGED, data: LEASE_STATES.EDIT_LEASE })

export const leaseEditClicked = (dispatch) =>
  dispatch({ type: ACTIONS.LEASE_SECTION_STATE_CHANGED, data: LEASE_STATES.EDIT_LEASE })

export const leaseCanceled = (dispatch, application) =>
  dispatch({ type: ACTIONS.LEASE_SECTION_STATE_CHANGED, data: getInitialLeaseState(application) })

export const updateLease = (dispatch, formApplication, prevApplication) =>
  wrapAsync(
    dispatch,
    () => saveLeaseAndAssistances(formApplication, prevApplication).catch(logErrorAndAlert),
    ({ lease, rentalAssistances }) => ({
      type: ACTIONS.LEASE_AND_ASSISTANCES_UPDATED,
      data: {
        lease,
        rentalAssistances,
        newLeaseSectionState: LEASE_STATES.SHOW_LEASE
      }
    })
  )

export const deleteLeaseClicked = (dispatch, prevApplication) =>
  wrapAsync(
    dispatch,
    () => deleteLease(prevApplication).catch(logErrorAndAlert),
    () => ({ type: ACTIONS.LEASE_DELETED })
  )
