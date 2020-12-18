import apiService from 'apiService'
import { deleteLease, saveLeaseAndAssistances } from 'components/supplemental_application/actions'
import {
  NO_LEASE_STATE,
  SHOW_LEASE_STATE,
  EDIT_LEASE_STATE,
  getInitialLeaseState,
  loadSupplementalApplicationPage,
  updateSavedPreference,
  updateSupplementalApplication,
  statusModalSubmit
} from 'context/actionCreators/applicationDetailsActionHelpers'
import {
  formatListingStateData,
  getApplicationDetailsBreadcrumbsData,
  getApplicationRowClickedBreadcrumbData
} from 'context/actionCreators/breadcrumbActionHelpers'
import {
  ACTION_TYPE_APPLICATION_TABLE_FILTERS_APPLIED,
  ACTION_TYPE_APPLICATION_TABLE_PAGE_CHANGED,
  ACTION_TYPE_RENTAL_ASSISTANCE_CREATE_SUCCESS,
  ACTION_TYPE_RENTAL_ASSISTANCE_DELETE_SUCCESS,
  ACTION_TYPE_CONFIRMED_PREFERENCES_FAILED,
  ACTION_TYPE_LEFT_APPLICATION_SCOPE,
  ACTION_TYPE_LEFT_LISTING_SCOPE,
  ACTION_TYPE_SELECTED_APPLICATION_CHANGED,
  ACTION_TYPE_SELECTED_LISTING_CHANGED,
  ACTION_TYPE_SHORTFORM_LOADED,
  ACTION_TYPE_STATE_UPDATED,
  ACTION_TYPE_STATUS_MODAL_UPDATED,
  ACTION_TYPE_SUPP_APP_LOAD_COMPLETE,
  ACTION_TYPE_SUPP_APP_LOAD_START,
  ACTION_TYPE_LEASE_AND_ASSISTANCES_UPDATED
} from 'context/actions'
import { getEmptyApplicationDetailsState } from 'context/subreducers/ApplicationDetailsSubreducer'
import formUtils from 'utils/formUtils'

const getListingChangedAction = (listing) => ({
  type: ACTION_TYPE_SELECTED_LISTING_CHANGED,
  data: formatListingStateData(listing)
})

export const createActions = (dispatch) => ({
  loadSupplementalPageData: (applicationId, listingId = null) =>
    loadSupplementalApplicationPage(dispatch, applicationId, listingId),
  updateSupplementalApplication: (leaseSectionState, formApplication, prevApplication) =>
    updateSupplementalApplication(dispatch, leaseSectionState, formApplication, prevApplication),
  updateSavedPreference: (preferenceIndex, formApplicationValues) =>
    updateSavedPreference(dispatch, preferenceIndex, formApplicationValues),
  preferencesFailedChanged: (failed) =>
    dispatch({ type: ACTION_TYPE_CONFIRMED_PREFERENCES_FAILED, data: { failed } }),
  openSuppAppAddCommentModal: (currentStatus) =>
    dispatch({
      type: ACTION_TYPE_STATUS_MODAL_UPDATED,
      data: {
        ...getEmptyApplicationDetailsState().supplemental.statusModal,
        header: 'Add New Comment',
        isOpen: true,
        status: currentStatus,
        submitButton: 'Save'
      }
    }),
  closeSuppAppStatusModal: () =>
    dispatch({ type: ACTION_TYPE_STATUS_MODAL_UPDATED, data: { isOpen: false } }),
  closeSuppAppStatusModalAlert: () =>
    dispatch({ type: ACTION_TYPE_STATUS_MODAL_UPDATED, data: { showAlert: false } }),
  leaseCreated: () =>
    dispatch({ type: ACTION_TYPE_STATE_UPDATED, data: { leaseSectionState: EDIT_LEASE_STATE } }),
  leaseEditClicked: () =>
    dispatch({ type: ACTION_TYPE_STATE_UPDATED, data: { leaseSectionState: EDIT_LEASE_STATE } }),
  leaseCanceled: (application) =>
    dispatch({
      type: ACTION_TYPE_STATE_UPDATED,
      data: { leaseSectionState: getInitialLeaseState(application) }
    }),
  leaseSaved: async (formApplication, prevApplication) => {
    dispatch({ type: ACTION_TYPE_SUPP_APP_LOAD_START })
    return saveLeaseAndAssistances(formApplication, prevApplication)
      .then(({ lease, rentalAssistances }) => {
        dispatch({
          type: ACTION_TYPE_LEASE_AND_ASSISTANCES_UPDATED,
          data: {
            lease,
            rentalAssistances,
            newLeaseSectionState: SHOW_LEASE_STATE
          }
        })
      })
      .finally(() => dispatch({ type: ACTION_TYPE_SUPP_APP_LOAD_COMPLETE }))
  },
  leaseDeleted: async (prevApplication) => {
    dispatch({ type: ACTION_TYPE_SUPP_APP_LOAD_START })
    return deleteLease(prevApplication)
      .then((_) => {
        dispatch({
          type: ACTION_TYPE_LEASE_AND_ASSISTANCES_UPDATED,
          data: {
            lease: {},
            rentalAssistances: [],
            newLeaseSectionState: NO_LEASE_STATE
          }
        })
      })
      .finally(() => dispatch({ type: ACTION_TYPE_SUPP_APP_LOAD_COMPLETE }))
  },
  createRentalAssistance: async (applicationId, rentalAssistance) => {
    dispatch({ type: ACTION_TYPE_SUPP_APP_LOAD_START })
    return apiService
      .createRentalAssistance(rentalAssistance, applicationId)
      .then(({ id }) => {
        const newRentalAssistance = {
          ...rentalAssistance,
          id,
          // show price in right format
          assistance_amount: formUtils.formatPrice(rentalAssistance.assistance_amount)
        }
        dispatch({
          type: ACTION_TYPE_RENTAL_ASSISTANCE_CREATE_SUCCESS,
          data: { newRentalAssistance }
        })
      })
      .finally(() => dispatch({ type: ACTION_TYPE_SUPP_APP_LOAD_COMPLETE }))
  },
  updateRentalAssistance: async (applicationId, updatedRentalAssistance) => {
    dispatch({ type: ACTION_TYPE_SUPP_APP_LOAD_START })
    return apiService
      .updateRentalAssistance(updatedRentalAssistance, applicationId)
      .then((_) => {
        dispatch({
          type: ACTION_TYPE_RENTAL_ASSISTANCE_CREATE_SUCCESS,
          data: {
            updatedRentalAssistance: {
              ...updatedRentalAssistance,
              // show price in right format
              assistance_amount: formUtils.formatPrice(updatedRentalAssistance.assistance_amount)
            }
          }
        })
      })
      .finally(() => dispatch({ type: ACTION_TYPE_SUPP_APP_LOAD_COMPLETE }))
  },
  supplementalAppTouched: async (wasTouched) => {
    dispatch({ type: ACTION_TYPE_STATE_UPDATED, data: { supplementalAppTouched: wasTouched } })
  },
  deleteRentalAssistance: async (idToDelete) => {
    dispatch({ type: ACTION_TYPE_SUPP_APP_LOAD_START })
    return apiService
      .deleteRentalAssistance(idToDelete)
      .then((_) => {
        dispatch({
          type: ACTION_TYPE_RENTAL_ASSISTANCE_DELETE_SUCCESS,
          data: { assistanceId: idToDelete }
        })
      })
      .finally(() => dispatch({ type: ACTION_TYPE_SUPP_APP_LOAD_COMPLETE }))
  },
  openSuppAppUpdateStatusModal: (newStatus) =>
    dispatch({
      type: ACTION_TYPE_STATUS_MODAL_UPDATED,
      data: {
        ...getEmptyApplicationDetailsState().supplemental.statusModal,
        submitButton: 'Update',
        header: 'Update Status',
        isOpen: true,
        status: newStatus
      }
    }),
  submitSuppAppStatusModal: (
    submittedValues,
    formApplication,
    prevApplication,
    leaseSectionState
  ) =>
    statusModalSubmit(
      dispatch,
      submittedValues,
      formApplication,
      prevApplication,
      leaseSectionState
    ),
  applicationPageLoadComplete: (application, listing, fileBaseUrl) =>
    dispatch({
      type: ACTION_TYPE_SHORTFORM_LOADED,
      data: {
        breadcrumbData: getApplicationDetailsBreadcrumbsData(application, listing),
        pageData: {
          application,
          listing,
          fileBaseUrl
        }
      }
    }),
  applicationsTableFiltersApplied: (filters) =>
    dispatch({ type: ACTION_TYPE_APPLICATION_TABLE_FILTERS_APPLIED, data: filters || {} }),
  applicationsTablePageChanged: (page) =>
    dispatch({ type: ACTION_TYPE_APPLICATION_TABLE_PAGE_CHANGED, data: page || 0 }),
  applicationsPageMounted: () => dispatch({ type: ACTION_TYPE_LEFT_APPLICATION_SCOPE }),
  listingsPageMounted: () => dispatch({ type: ACTION_TYPE_LEFT_LISTING_SCOPE }),
  applicationsPageLoadComplete: (listing) => dispatch(getListingChangedAction(listing)),
  listingRowClicked: (listing) => dispatch(getListingChangedAction(listing)),
  applicationRowClicked: (application) =>
    dispatch({
      type: ACTION_TYPE_SELECTED_APPLICATION_CHANGED,
      data: getApplicationRowClickedBreadcrumbData(application)
    })
})
