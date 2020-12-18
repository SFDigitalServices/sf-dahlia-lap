import { cloneDeep, findIndex } from 'lodash'

import ACTIONS from '../actions'

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
    applicationMembers: [],
    statusModal: {
      alertMsg: null,
      header: null,
      isOpen: false,
      loading: false,
      showAlert: false,
      status: null,
      substatus: null,
      submitButton: null
    }
  }
})

const setSupplementalOverrides = (state, overrides) => ({
  ...state,
  supplemental: {
    ...state.supplemental,
    ...overrides,
    applicationMembers: [
      state.supplemental.application?.applicant,
      ...(state.supplemental.application?.household_members || [])
    ],
    statusModal: {
      ...state.supplemental.statusModal,
      ...overrides.statusModal
    }
  }
})

const APPLICATION_DETAILS_ACTIONS = {
  [ACTIONS.LEFT_APPLICATION_SCOPE]: (_, __) => getEmptyApplicationDetailsState(),
  [ACTIONS.SHORTFORM_LOADED]: (state, { pageData }) => ({
    ...state,
    shortform: pageData
  }),
  [ACTIONS.SUPP_APP_LOAD_START]: (state, { additionalOverrides } = {}) =>
    setSupplementalOverrides(state, { loading: true, ...additionalOverrides }),
  [ACTIONS.SUPP_APP_LOAD_SUCCESS]: (state, { pageData }) =>
    setSupplementalOverrides(state, pageData),
  [ACTIONS.SUPP_APP_LOAD_COMPLETE]: (state, { additionalOverrides } = {}) =>
    setSupplementalOverrides(state, { loading: false, ...additionalOverrides }),
  [ACTIONS.SUPP_APP_LOAD_FAIL]: (state, { additionalOverrides } = {}) =>
    setSupplementalOverrides(state, additionalOverrides),
  [ACTIONS.CONFIRMED_PREFERENCES_FAILED]: (state, { failed }) =>
    setSupplementalOverrides(state, { confirmedPreferencesFailed: failed }),
  [ACTIONS.STATUS_MODAL_UPDATED]: (state, data) =>
    setSupplementalOverrides(state, { statusModal: data }),
  [ACTIONS.STATE_UPDATED]: (state, data) => setSupplementalOverrides(state, data),
  [ACTIONS.LEASE_AND_ASSISTANCES_UPDATED]: (
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
  [ACTIONS.RENTAL_ASSISTANCE_CREATE_SUCCESS]: (state, { newRentalAssistance }) =>
    setSupplementalOverrides(state, {
      application: {
        ...state.supplemental.application,
        rental_assistances: [
          ...state.supplemental.application.rental_assistances,
          newRentalAssistance
        ]
      }
    }),
  [ACTIONS.RENTAL_ASSISTANCE_UPDATE_SUCCESS]: (state, { updatedRentalAssistance }) => {
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
  [ACTIONS.RENTAL_ASSISTANCE_DELETE_SUCCESS]: (state, { assistanceId }) => {
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
