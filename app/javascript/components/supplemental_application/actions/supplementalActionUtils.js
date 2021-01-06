import { cloneDeep } from 'lodash'

import Alerts from 'components/Alerts'
import LEASE_STATES from 'components/supplemental_application/utils/leaseSectionStates'
import ACTIONS from 'context/actions'

export const wrapAsync = async (
  dispatch,
  promiseFunc,
  getSuccessAction = () => {},
  getFailAction = () => {},
  alsoSetStatusModalLoading = false
) => {
  dispatch({
    type: ACTIONS.SUPP_APP_LOAD_START,
    data: alsoSetStatusModalLoading ? { statusModal: { loading: true } } : null
  })

  const maybeDispatch = (action) => action?.type && dispatch(action)

  return promiseFunc()
    .then((response) => maybeDispatch(getSuccessAction(response)))
    .catch((e) => maybeDispatch(getFailAction(e)))
    .finally(() =>
      dispatch({
        type: ACTIONS.SUPP_APP_LOAD_COMPLETE,
        data: alsoSetStatusModalLoading ? { statusModal: { loading: false } } : null
      })
    )
}

export const logErrorAndAlert = (e) => {
  console.error(e)
  Alerts.error()
}

export const setApplicationDefaults = (application) => {
  const applicationWithDefaults = cloneDeep(application)
  // Logic in Lease Section in order to show 'Select One' placeholder on Preference Used if a selection was never made
  if (
    applicationWithDefaults.lease &&
    !applicationWithDefaults.lease.no_preference_used &&
    applicationWithDefaults.lease.preference_used == null
  ) {
    delete applicationWithDefaults.lease.preference_used
  }
  return applicationWithDefaults
}

export const getApplicationStateOverridesAfterUpdate = (
  prevLeaseSectionState,
  applicationResponse,
  additionalFieldsToUpdate = {}
) => {
  const leaveEditMode = (currentLeaseSectionState) =>
    currentLeaseSectionState === LEASE_STATES.EDIT_LEASE
      ? LEASE_STATES.SHOW_LEASE
      : currentLeaseSectionState

  return {
    application: setApplicationDefaults(applicationResponse),
    leaseSectionState: leaveEditMode(prevLeaseSectionState),
    ...additionalFieldsToUpdate
  }
}

export const shouldSaveLeaseOnApplicationSave = (leaseState) =>
  leaseState === LEASE_STATES.EDIT_LEASE
