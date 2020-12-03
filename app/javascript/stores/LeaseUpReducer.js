export const ACTION_SET_CURRENT_LISTING = 'SET_CURRENT_LISTING'
export const ACTION_SET_CURRENT_APPLICATION = 'SET_CURRENT_APPLICATION'
export const ACTION_SUPP_APPLICATION_LOADED = 'SUPP_APPLICATION_LOADED'

const LeaseUpReducer = (state, action) => {
  switch (action.type) {
    case ACTION_SET_CURRENT_LISTING:
      return {
        ...state,
        breadcrumbData: {
          ...state.breadcrumbData,
          listing: action.data
        }
      }
    case ACTION_SET_CURRENT_APPLICATION:
      return {
        ...state,
        breadcrumbData: {
          ...state.breadcrumbData,
          application: action.data
        }
      }
    case ACTION_SUPP_APPLICATION_LOADED:
      return {
        ...state,
        breadcrumbData: {
          ...state.breadcrumbData,
          application: action.data.application,
          listing: action.data.listing
        }
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

export default LeaseUpReducer
