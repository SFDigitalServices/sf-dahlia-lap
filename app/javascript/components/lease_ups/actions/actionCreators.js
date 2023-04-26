import {
  formatListingStateData,
  getApplicationRowClickedBreadcrumbData
} from 'components/lease_ups/actions/breadcrumbActionHelpers'
import ACTIONS from 'context/actions'

const getListingChangedAction = (listing) => ({
  type: ACTIONS.SELECTED_LISTING_CHANGED,
  data: formatListingStateData(listing)
})

export const applicationsTableFiltersApplied = (dispatch, filters) =>
  dispatch({ type: ACTIONS.APPLICATION_TABLE_FILTERS_APPLIED, data: filters || {} })

export const applicationsTablePageChanged = (dispatch, page) =>
  dispatch({ type: ACTIONS.APPLICATION_TABLE_PAGE_CHANGED, data: page || 0 })

export const applicationsPageMounted = (dispatch) =>
  dispatch({ type: ACTIONS.LEFT_APPLICATION_SCOPE })

export const listingsPageMounted = (dispatch) => dispatch({ type: ACTIONS.LEFT_LISTING_SCOPE })

export const applicationsPageLoadComplete = (dispatch, listing) =>
  dispatch(getListingChangedAction(listing))

export const listingRowClicked = (dispatch, listing) => dispatch(getListingChangedAction(listing))

export const applicationRowClicked = (dispatch, application) =>
  dispatch({
    type: ACTIONS.SELECTED_APPLICATION_CHANGED,
    data: getApplicationRowClickedBreadcrumbData(application)
  })
