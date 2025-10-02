import LEASE_STATES, {
  getInitialLeaseState
} from 'components/supplemental_application/utils/leaseSectionStates'
import ACTIONS from 'context/actions'

export const leaseCreated = (dispatch) =>
  dispatch({ type: ACTIONS.LEASE_SECTION_STATE_CHANGED, data: LEASE_STATES.EDIT_LEASE })

export const leaseEditClicked = (dispatch) =>
  dispatch({ type: ACTIONS.LEASE_SECTION_STATE_CHANGED, data: LEASE_STATES.EDIT_LEASE })

export const leaseCanceled = (dispatch, application) =>
  dispatch({ type: ACTIONS.LEASE_SECTION_STATE_CHANGED, data: getInitialLeaseState(application) })
