import {
  ACTION_TYPE_LEFT_APPLICATION_SCOPE,
  ACTION_TYPE_SHORTFORM_LOADED,
  ACTION_TYPE_SUPP_APP_LOADED
} from '../actions'

const getEmptyApplicationDetailsState = () => ({
  shortform: null,
  supplemental: null
})

const APPLICATION_DETAILS_ACTIONS = {
  [ACTION_TYPE_LEFT_APPLICATION_SCOPE]: (_, __) => getEmptyApplicationDetailsState(),
  [ACTION_TYPE_SHORTFORM_LOADED]: (state, data) => ({
    ...state,
    shortform: data
  }),
  [ACTION_TYPE_SUPP_APP_LOADED]: (state, data) => ({
    ...state,
    supplemental: data
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
