import LEASE_STATES from 'components/supplemental_application/utils/leaseSectionStates'

import ACTIONS from '../actions'

// This id is never sent to the backend, only used to identify frontend
// "new" assistance objects that haven't been persisted yet.
export const NEW_ASSISTANCE_PSEUDO_ID = -101

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
    statusModal: getEmptyStatusModalState(),
    preferenceRowsOpened: new Set(), // set of indexes corresponding to preferences on an application
    assistanceRowsOpened: new Set() // set of assistance IDs
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

const plus = (set, newItem) => new Set([...set, newItem])
const minus = (set, itemToDelete) => {
  const clonedSet = new Set([...set])
  clonedSet.delete(itemToDelete)
  return clonedSet
}

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
  [ACTIONS.PREF_TABLE_ROW_OPENED]: (state, data) =>
    setSupplementalOverrides(state, {
      preferenceRowsOpened: plus(state.supplemental.preferenceRowsOpened, data.rowIndex)
    }),
  [ACTIONS.PREF_TABLE_ROW_CLOSED]: (state, data) =>
    setSupplementalOverrides(state, {
      preferenceRowsOpened: minus(state.supplemental.preferenceRowsOpened, data.rowIndex)
    }),
  [ACTIONS.ASSISTANCE_TABLE_ROW_OPENED]: (state, data) =>
    setSupplementalOverrides(state, {
      assistanceRowsOpened: plus(state.supplemental.assistanceRowsOpened, data.assistanceId)
    }),
  [ACTIONS.ASSISTANCE_TABLE_ROW_CLOSED]: (state, data) =>
    setSupplementalOverrides(state, {
      assistanceRowsOpened: minus(state.supplemental.assistanceRowsOpened, data.assistanceId)
    }),
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
        ...state.supplemental.statusModal,
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
      leaseSectionState: newLeaseSectionState,
      assistanceRowsOpened: new Set()
    }),
  [ACTIONS.LEASE_DELETED]: (state) =>
    setSupplementalOverrides(state, {
      application: {
        ...state.supplemental.application,
        lease: {},
        rental_assistances: []
      },
      leaseSectionState: LEASE_STATES.NO_LEASE,
      assistanceRowsOpened: new Set()
    }),
  [ACTIONS.RENTAL_ASSISTANCE_CREATE_SUCCESS]: (state, { newRentalAssistance }) =>
    setSupplementalOverrides(state, {
      application: {
        ...state.supplemental.application,
        rental_assistances: [
          ...state.supplemental.application.rental_assistances,
          newRentalAssistance
        ]
      },
      assistanceRowsOpened: minus(state.supplemental.assistanceRowsOpened, NEW_ASSISTANCE_PSEUDO_ID)
    }),
  [ACTIONS.RENTAL_ASSISTANCE_UPDATE_SUCCESS]: (state, { updatedRentalAssistance }) => {
    const { application } = state.supplemental
    return setSupplementalOverrides(state, {
      application: {
        ...application,
        rental_assistances: application.rental_assistances.map((ra) =>
          ra.id === updatedRentalAssistance.id ? updatedRentalAssistance : ra
        )
      },
      assistanceRowsOpened: minus(
        state.supplemental.assistanceRowsOpened,
        updatedRentalAssistance.id ?? NEW_ASSISTANCE_PSEUDO_ID
      )
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
      },
      assistanceRowsOpened: minus(state.supplemental.assistanceRowsOpened, assistanceId)
    })
  },
  [ACTIONS.LEASE_SECTION_STATE_CHANGED]: (state, data) =>
    setSupplementalOverrides(state, {
      leaseSectionState: data,
      // If you're no longer editing the lease, all "edit assistance" forms should close.
      ...(data !== LEASE_STATES.EDIT_LEASE && {
        assistanceRowsOpened: new Set()
      })
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
