/**
 * Action Definitions below. Actions should be named like a
 * past-tense event.
 */
export default {
  // Lease-up navigation actions
  LEFT_APPLICATION_SCOPE: 'LEFT_APPLICATION_SCOPE',
  LEFT_LISTING_SCOPE: 'LEFT_LISTING_SCOPE',
  SELECTED_APPLICATION_CHANGED: 'SELECTED_APPLICATION_CHANGED',
  SELECTED_LISTING_CHANGED: 'SELECTED_LISTING_CHANGED',

  // ApplicationDetails Actions
  CONFIRMED_PREFERENCES_FAILED: 'CONFIRMED_PREFERENCES_FAILED',
  LEASE_AND_ASSISTANCES_UPDATED: 'LEASE_AND_ASSISTANCES_UPDATED',
  LEASE_DELETED: 'LEASE_DELETED',
  LEASE_SECTION_STATE_CHANGED: 'LEASE_SECTION_STATE_CHANGED',
  RENTAL_ASSISTANCE_CREATE_SUCCESS: 'RENTAL_ASSISTANCE_CREATE_SUCCESS',
  RENTAL_ASSISTANCE_DELETE_SUCCESS: 'RENTAL_ASSISTANCE_DELETE_SUCCESS',
  RENTAL_ASSISTANCE_UPDATE_SUCCESS: 'RENTAL_ASSISTANCE_UPDATE_SUCCESS',
  SHORTFORM_LOADED: 'SHORTFORM_LOADED',
  STATUS_MODAL_ERROR: 'STATUS_MODAL_ERROR',
  STATUS_MODAL_UPDATED: 'STATUS_MODAL_UPDATED',
  SUPP_APP_INITIAL_LOAD_SUCCESS: 'SUPP_APP_INITIAL_LOAD_SUCCESS',
  SUPP_APP_LOAD_COMPLETE: 'SUPP_APP_LOAD_COMPLETE',
  SUPP_APP_LOAD_START: 'SUPP_APP_LOAD_START',
  SUPP_APP_LOAD_SUCCESS: 'SUPP_APP_LOAD_SUCCESS',

  // Applications List Page actions
  APPLICATION_TABLE_FILTERS_APPLIED: 'APPLICATION_TABLE_FILTERS_APPLIED',
  APPLICATION_TABLE_PAGE_CHANGED: 'APPLICATION_TABLE_PAGE_CHANGED'
}
