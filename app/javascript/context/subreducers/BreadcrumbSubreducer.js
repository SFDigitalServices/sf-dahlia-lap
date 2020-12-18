import ACTIONS from '../actions'

const getEmptyListing = () => ({
  id: null,
  name: null,
  buildingAddress: null
})

const getEmptyApplication = () => ({
  id: null,
  number: null,
  applicantFullName: null
})

const overrideBreadcrumbData = (state, { listing, application }) => ({
  ...state,
  ...(listing && {
    listing: {
      ...getEmptyListing(),
      ...listing
    }
  }),
  ...(application && {
    application: {
      ...getEmptyApplication(),
      ...application
    }
  })
})

export const BREADCRUMB_ACTIONS = {
  [ACTIONS.SELECTED_LISTING_CHANGED]: (state, data) =>
    overrideBreadcrumbData(state, {
      listing: data
    }),
  [ACTIONS.SELECTED_APPLICATION_CHANGED]: (state, data) =>
    overrideBreadcrumbData(state, {
      application: data
    }),
  [ACTIONS.LEFT_LISTING_SCOPE]: (state, _) =>
    overrideBreadcrumbData(state, {
      listing: getEmptyListing()
    }),
  [ACTIONS.LEFT_APPLICATION_SCOPE]: (state, _) =>
    overrideBreadcrumbData(state, {
      application: getEmptyApplication()
    }),
  [ACTIONS.SUPP_APP_LOAD_SUCCESS]: (state, { application, listing }) =>
    overrideBreadcrumbData(state, {
      application,
      listing
    }),
  [ACTIONS.SHORTFORM_LOADED]: (state, { breadcrumbData: { application, listing } }) =>
    overrideBreadcrumbData(state, {
      application,
      listing
    })
}

const BreadcrumbSubreducer = {
  reducer: (state, action) => {
    if (!(action.type in BREADCRUMB_ACTIONS)) {
      throw new Error(`BreadcrumbReducer: Unhandled action type: ${action.type}`)
    }

    return BREADCRUMB_ACTIONS[action.type](state, action.data)
  },
  handlesActionType: (actionType) => actionType in BREADCRUMB_ACTIONS,
  getInitialState: () => ({
    application: getEmptyApplication(),
    listing: getEmptyListing()
  })
}

export default BreadcrumbSubreducer
