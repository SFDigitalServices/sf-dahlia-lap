import { cloneDeep, findIndex } from 'lodash'

import {
  ACTION_TYPE_CONFIRMED_PREFERENCES_FAILED,
  ACTION_TYPE_SUPP_APP_LOAD_FAIL,
  ACTION_TYPE_SUPP_APP_LOAD_COMPLETE,
  ACTION_TYPE_SUPP_APP_LOAD_START,
  ACTION_TYPE_LEFT_APPLICATION_SCOPE,
  ACTION_TYPE_SHORTFORM_LOADED,
  ACTION_TYPE_STATE_UPDATED,
  ACTION_TYPE_STATUS_MODAL_UPDATED,
  ACTION_TYPE_SUPP_APP_LOAD_SUCCESS,
  ACTION_TYPE_LEASE_AND_ASSISTANCES_UPDATED,
  ACTION_TYPE_RENTAL_ASSISTANCE_UPDATE_SUCCESS,
  ACTION_TYPE_RENTAL_ASSISTANCE_DELETE_SUCCESS,
  ACTION_TYPE_RENTAL_ASSISTANCE_CREATE_SUCCESS
} from '../actions'

export const getEmptyApplicationDetailsState = () => ({
  shortform: {
    application: null,
    fileBaseUrl: null
  },
  supplemental: {
    application: null,
    confirmedPreferencesFailed: false,
    fileBaseUrl: null,
    leaseSectionState: null,
    leaveConfirmationModalOpen: false,
    listing: null,
    listingAmiCharts: null,
    loading: false,
    rentalAssistances: null,
    statusHistory: null,
    supplementalAppTouched: false,
    units: null,
    statusModal: {
      alertMsg: null,
      header: null,
      isOpen: false,
      loading: false,
      showAlert: false,
      status: null,
      submitButton: null
    }
  }
})

const setSupplementalOverrides = (state, overrides) => ({
  ...state,
  supplemental: {
    ...state.supplemental,
    ...overrides,
    statusModal: {
      ...state.supplemental.statusModal,
      ...overrides.statusModal
    }
  }
})

const APPLICATION_DETAILS_ACTIONS = {
  [ACTION_TYPE_LEFT_APPLICATION_SCOPE]: (_, __) => getEmptyApplicationDetailsState(),
  [ACTION_TYPE_SHORTFORM_LOADED]: (state, { pageData }) => ({
    ...state,
    shortform: pageData
  }),
  [ACTION_TYPE_SUPP_APP_LOAD_START]: (state, { additionalOverrides } = {}) =>
    setSupplementalOverrides(state, { loading: true, ...additionalOverrides }),
  [ACTION_TYPE_SUPP_APP_LOAD_SUCCESS]: (state, { pageData }) =>
    setSupplementalOverrides(state, pageData),
  [ACTION_TYPE_SUPP_APP_LOAD_COMPLETE]: (state, { additionalOverrides } = {}) =>
    setSupplementalOverrides(state, { loading: false, ...additionalOverrides }),
  [ACTION_TYPE_SUPP_APP_LOAD_FAIL]: (state, { additionalOverrides } = {}) =>
    setSupplementalOverrides(state, additionalOverrides),
  [ACTION_TYPE_CONFIRMED_PREFERENCES_FAILED]: (state, { failed }) =>
    setSupplementalOverrides(state, { confirmedPreferencesFailed: failed }),
  [ACTION_TYPE_STATUS_MODAL_UPDATED]: (state, data) =>
    setSupplementalOverrides(state, { statusModal: data }),
  [ACTION_TYPE_STATE_UPDATED]: (state, data) => setSupplementalOverrides(state, data),
  [ACTION_TYPE_LEASE_AND_ASSISTANCES_UPDATED]: (
    state,
    { lease, rentalAssistances, newLeaseSectionState }
  ) =>
    setSupplementalOverrides(state, {
      application: {
        ...state.supplemental.application,
        lease,
        rental_assistances: rentalAssistances
      },
      leaseSectionState: newLeaseSectionState
    }),
  [ACTION_TYPE_RENTAL_ASSISTANCE_CREATE_SUCCESS]: (state, { newRentalAssistance }) =>
    setSupplementalOverrides(state, {
      application: {
        ...state.supplemental.application,
        rental_assistances: [
          ...state.supplemental.application.rental_assistances,
          newRentalAssistance
        ]
      }
    }),
  [ACTION_TYPE_RENTAL_ASSISTANCE_UPDATE_SUCCESS]: (state, { updatedRentalAssistance }) => {
    const newAssistances = cloneDeep(state.supplemental.application.rental_assistances)
    const idx = findIndex(newAssistances, { id: updatedRentalAssistance.id })
    newAssistances[idx] = updatedRentalAssistance
    return setSupplementalOverrides(state, {
      application: {
        ...state.supplemental.application,
        rental_assistances: newAssistances
      }
    })
  },
  [ACTION_TYPE_RENTAL_ASSISTANCE_DELETE_SUCCESS]: (state, { assistanceId }) => {
    const newAssistances = cloneDeep(state.supplemental.application.rental_assistances)
    const idx = findIndex(newAssistances, { id: assistanceId })
    newAssistances.splice(idx)
    return setSupplementalOverrides(state, {
      application: {
        ...state.supplemental.application,
        rental_assistances: newAssistances
      }
    })
  }
}

const ApplicationDetailsSubreducer = {
  reducer: (state, action) => {
    if (!(action.type in APPLICATION_DETAILS_ACTIONS)) {
      throw new Error(`ApplicationDetailsReducer: Unhandled action type: ${action.type}`)
    }

    return APPLICATION_DETAILS_ACTIONS[action.type](state, action.data)
  },
  handlesActionType: (actionType) => actionType in APPLICATION_DETAILS_ACTIONS,
  getInitialState: () => getEmptyApplicationDetailsState()
}

export default ApplicationDetailsSubreducer
