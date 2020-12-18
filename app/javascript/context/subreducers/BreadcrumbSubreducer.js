import {
  ACTION_TYPE_SELECTED_LISTING_CHANGED,
  ACTION_TYPE_SELECTED_APPLICATION_CHANGED,
  ACTION_TYPE_LEFT_LISTING_SCOPE,
  ACTION_TYPE_LEFT_APPLICATION_SCOPE,
  ACTION_TYPE_SUPP_APP_LOAD_SUCCESS,
  ACTION_TYPE_SHORTFORM_LOADED
} from '../actions'

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
  [ACTION_TYPE_SELECTED_LISTING_CHANGED]: (state, data) =>
    overrideBreadcrumbData(state, {
      listing: data
    }),
  [ACTION_TYPE_SELECTED_APPLICATION_CHANGED]: (state, data) =>
    overrideBreadcrumbData(state, {
      application: data
    }),
  [ACTION_TYPE_LEFT_LISTING_SCOPE]: (state, _) =>
    overrideBreadcrumbData(state, {
      listing: getEmptyListing()
    }),
  [ACTION_TYPE_LEFT_APPLICATION_SCOPE]: (state, _) =>
    overrideBreadcrumbData(state, {
      application: getEmptyApplication()
    }),
  [ACTION_TYPE_SUPP_APP_LOAD_SUCCESS]: (state, { application, listing }) =>
    overrideBreadcrumbData(state, {
      application,
      listing
    }),
  [ACTION_TYPE_SHORTFORM_LOADED]: (state, { breadcrumbData: { application, listing } }) =>
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
