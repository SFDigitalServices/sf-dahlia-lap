export const ACTION_SET_CURRENT_LISTING = 'SET_CURRENT_LISTING'
export const ACTION_SET_CURRENT_APPLICATION = 'SET_CURRENT_APPLICATION'
export const ACTION_CLEAR_CURRENT_LISTING = 'CLEAR_CURRENT_LISTING'
export const ACTION_CLEAR_CURRENT_APPLICATION = 'CLEAR_CURRENT_APPLICATION'
export const ACTION_SUPP_APPLICATION_LOADED = 'SUPP_APPLICATION_LOADED'

export const EMPTY_LISTING_BREADCRUMB = {
  id: null,
  name: null,
  buildingAddress: null
}

export const EMPTY_APPLICATION_BREADCRUMB = {
  id: null,
  name: null,
  buildingAddress: null
}

const overrideBreadcrumbData = (state, breadcrumbDataOverrides) => ({
  ...state,
  breadcrumbData: {
    ...state.breadcrumbData,
    ...breadcrumbDataOverrides
  }
})

const LeaseUpReducer = (state, action) => {
  switch (action.type) {
    case ACTION_SET_CURRENT_LISTING:
      return overrideBreadcrumbData(state, {
        listing: action.data
      })
    case ACTION_CLEAR_CURRENT_LISTING:
      return overrideBreadcrumbData(state, {
        listing: EMPTY_LISTING_BREADCRUMB
      })
    case ACTION_SET_CURRENT_APPLICATION:
      return overrideBreadcrumbData(state, {
        application: action.data
      })
    case ACTION_CLEAR_CURRENT_APPLICATION:
      return overrideBreadcrumbData(state, {
        application: EMPTY_APPLICATION_BREADCRUMB
      })
    case ACTION_SUPP_APPLICATION_LOADED:
      return overrideBreadcrumbData(state, {
        application: action.data.application,
        listing: action.data.listing
      })
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

export default LeaseUpReducer
