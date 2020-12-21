import { cloneDeep, findIndex } from 'lodash'

import { NO_LEASE_STATE } from 'context/actionCreators/application_details/leaseUiStates'

import ACTIONS from '../actions'

export const getEmptyStatusModalState = () => ({
  alertMsg: null,
  header: null,
  isOpen: false,
  loading: false,
  showAlert: false,
  status: null,
  substatus: null,
  submitButton: null
})

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
    units: null,
    applicationMembers: [],
    statusModal: getEmptyStatusModalState()
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
  [ACTIONS.SUPP_APP_LOAD_START]: (state, data = {}) =>
    setSupplementalOverrides(state, { loading: true, ...data }),
  [ACTIONS.SUPP_APP_INITIAL_LOAD_SUCCESS]: (state, { pageData }) =>
    setSupplementalOverrides(state, pageData),
  [ACTIONS.SUPP_APP_LOAD_SUCCESS]: (state, data = {}) => setSupplementalOverrides(state, data),
  [ACTIONS.SUPP_APP_LOAD_COMPLETE]: (state, data = {}) =>
    setSupplementalOverrides(state, { loading: false, ...data }),
  [ACTIONS.CONFIRMED_PREFERENCES_FAILED]: (state, { failed }) =>
    setSupplementalOverrides(state, { confirmedPreferencesFailed: failed }),
  [ACTIONS.STATUS_MODAL_UPDATED]: (state, data) =>
    setSupplementalOverrides(state, { statusModal: data }),
  [ACTIONS.STATUS_MODAL_ERROR]: (state, _) =>
    setSupplementalOverrides(state, {
      statusModal: {
        ...state.statusModal,
        loading: false,
        showAlert: true,
        alertMsg: 'We were unable to make the update, please try again.'
      }
    }),
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
  [ACTIONS.LEASE_DELETED]: (state) =>
    setSupplementalOverrides(state, {
      application: {
        ...state.supplemental.application,
        lease: {},
        rental_assistances: []
      },
      leaseSectionState: NO_LEASE_STATE
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
  },
  [ACTIONS.LEASE_SECTION_STATE_CHANGED]: (state, data) =>
    setSupplementalOverrides(state, {
      leaseSectionState: data
    })
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
