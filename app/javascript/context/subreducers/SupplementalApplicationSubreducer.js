import LEASE_STATES from 'components/supplemental_application/utils/leaseSectionStates'

import ACTIONS from '../actions'

export const getEmptyStatusModalState = () => ({
  alertMsg: null,
  isOpen: false,
  loading: false,
  showAlert: false,
  status: null,
  substatus: null,
  isInAddCommentMode: false
})

const getEmptySupplementalPageState = () => ({
  shortform: {
    application: null,
    fileBaseUrl: null
  },
  supplemental: {
    application: null,
    confirmedPreferencesFailed: false,
    fileBaseUrl: null,
    leaseSectionState: null,
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

const setSupplementalOverrides = (state, overrides = {}) => ({
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
  [ACTIONS.LEFT_APPLICATION_SCOPE]: (_, __) => getEmptySupplementalPageState(),
  [ACTIONS.SHORTFORM_LOADED]: (state, { pageData }) => ({
    ...state,
    shortform: {
      ...state.shortform,
      ...pageData
    }
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
      leaseSectionState: LEASE_STATES.NO_LEASE
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
    const { application } = state.supplemental
    return setSupplementalOverrides(state, {
      application: {
        ...application,
        rental_assistances: application.rental_assistances.map((ra) =>
          ra.id === updatedRentalAssistance.id ? updatedRentalAssistance : ra
        )
      }
    })
  },
  [ACTIONS.RENTAL_ASSISTANCE_DELETE_SUCCESS]: (state, { assistanceId }) => {
    const { application } = state.supplemental
    return setSupplementalOverrides(state, {
      application: {
        ...application,
        rental_assistances: application.rental_assistances
          .map((ra) => (ra.id === assistanceId ? null : ra))
          .filter((ra) => !!ra)
      }
    })
  },
  [ACTIONS.LEASE_SECTION_STATE_CHANGED]: (state, data) =>
    setSupplementalOverrides(state, {
      leaseSectionState: data
    })
}

const SupplementalApplicationSubreducer = {
  reducer: (state, action) => {
    if (!(action.type in APPLICATION_DETAILS_ACTIONS)) {
      throw new Error(`SupplementalApplicationReducer: Unhandled action type: ${action.type}`)
    }

    return APPLICATION_DETAILS_ACTIONS[action.type](state, action.data)
  },
  handlesActionType: (actionType) => actionType in APPLICATION_DETAILS_ACTIONS,
  getInitialState: () => getEmptySupplementalPageState()
}

export default SupplementalApplicationSubreducer
