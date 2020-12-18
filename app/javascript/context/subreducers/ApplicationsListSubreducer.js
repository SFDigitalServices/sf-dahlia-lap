import ACTIONS from '../actions'

const getEmptyApplicationsListData = () => ({
  appliedFilters: {},
  page: 0
})

const overrideApplicationPageData = (state, { appliedFilters, page }) => ({
  ...state,
  ...(appliedFilters && { appliedFilters }),
  ...(!(page === undefined || page === null) && { page })
})

const APPLICATIONS_LIST_ACTIONS = {
  [ACTIONS.LEFT_LISTING_SCOPE]: (state, _) =>
    overrideApplicationPageData(state, getEmptyApplicationsListData()),
  [ACTIONS.APPLICATION_TABLE_FILTERS_APPLIED]: (state, data) =>
    overrideApplicationPageData(state, { appliedFilters: data, page: 0 }),
  [ACTIONS.APPLICATION_TABLE_PAGE_CHANGED]: (state, data) =>
    overrideApplicationPageData(state, { page: data })
}

const ApplicationsListSubreducer = {
  reducer: (state, action) => {
    if (!(action.type in APPLICATIONS_LIST_ACTIONS)) {
      throw new Error(`ApplicationsListReducer: Unhandled action type: ${action.type}`)
    }

    return APPLICATIONS_LIST_ACTIONS[action.type](state, action.data)
  },
  handlesActionType: (actionType) => actionType in APPLICATIONS_LIST_ACTIONS,
  getInitialState: () => getEmptyApplicationsListData()
}

export default ApplicationsListSubreducer
