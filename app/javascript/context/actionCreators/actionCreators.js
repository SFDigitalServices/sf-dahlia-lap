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
  getApplicationRowClickedBreadcrumbData
} from 'context/actionCreators/breadcrumbActionHelpers'
import ACTIONS from 'context/actions'
import { getEmptyApplicationDetailsState } from 'context/subreducers/ApplicationDetailsSubreducer'
import formUtils from 'utils/formUtils'

const getListingChangedAction = (listing) => ({
  type: ACTIONS.SELECTED_LISTING_CHANGED,
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
    dispatch({ type: ACTIONS.CONFIRMED_PREFERENCES_FAILED, data: { failed } }),
  openSuppAppAddCommentModal: (statusHistory) => {
    const currentStatusItem = statusHistory?.[0]
    dispatch({
      type: ACTIONS.STATUS_MODAL_UPDATED,
      data: {
        ...getEmptyApplicationDetailsState().supplemental.statusModal,
        header: 'Add New Comment',
        isOpen: true,
        status: currentStatusItem?.status,
        subStatus: currentStatusItem?.substatus,
        submitButton: 'Save'
      }
    })
  },
  closeSuppAppStatusModal: () =>
    dispatch({ type: ACTIONS.STATUS_MODAL_UPDATED, data: { isOpen: false } }),
  closeSuppAppStatusModalAlert: () =>
    dispatch({ type: ACTIONS.STATUS_MODAL_UPDATED, data: { showAlert: false } }),
  leaseCreated: () =>
    dispatch({ type: ACTIONS.STATE_UPDATED, data: { leaseSectionState: EDIT_LEASE_STATE } }),
  leaseEditClicked: () =>
    dispatch({ type: ACTIONS.STATE_UPDATED, data: { leaseSectionState: EDIT_LEASE_STATE } }),
  leaseCanceled: (application) =>
    dispatch({
      type: ACTIONS.STATE_UPDATED,
      data: { leaseSectionState: getInitialLeaseState(application) }
    }),
  leaseSaved: async (formApplication, prevApplication) => {
    dispatch({ type: ACTIONS.SUPP_APP_LOAD_START })
    return saveLeaseAndAssistances(formApplication, prevApplication)
      .then(({ lease, rentalAssistances }) => {
        dispatch({
          type: ACTIONS.LEASE_AND_ASSISTANCES_UPDATED,
          data: {
            lease,
            rentalAssistances,
            newLeaseSectionState: SHOW_LEASE_STATE
          }
        })
      })
      .finally(() => dispatch({ type: ACTIONS.SUPP_APP_LOAD_COMPLETE }))
  },
  leaseDeleted: async (prevApplication) => {
    dispatch({ type: ACTIONS.SUPP_APP_LOAD_START })
    return deleteLease(prevApplication)
      .then((_) => {
        dispatch({
          type: ACTIONS.LEASE_AND_ASSISTANCES_UPDATED,
          data: {
            lease: {},
            rentalAssistances: [],
            newLeaseSectionState: NO_LEASE_STATE
          }
        })
      })
      .finally(() => dispatch({ type: ACTIONS.SUPP_APP_LOAD_COMPLETE }))
  },
  createRentalAssistance: async (applicationId, rentalAssistance) => {
    dispatch({ type: ACTIONS.SUPP_APP_LOAD_START })
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
          type: ACTIONS.RENTAL_ASSISTANCE_CREATE_SUCCESS,
          data: { newRentalAssistance }
        })
      })
      .finally(() => dispatch({ type: ACTIONS.SUPP_APP_LOAD_COMPLETE }))
  },
  updateRentalAssistance: async (applicationId, updatedRentalAssistance) => {
    dispatch({ type: ACTIONS.SUPP_APP_LOAD_START })
    return apiService
      .updateRentalAssistance(updatedRentalAssistance, applicationId)
      .then((_) => {
        dispatch({
          type: ACTIONS.RENTAL_ASSISTANCE_CREATE_SUCCESS,
          data: {
            updatedRentalAssistance: {
              ...updatedRentalAssistance,
              // show price in right format
              assistance_amount: formUtils.formatPrice(updatedRentalAssistance.assistance_amount)
            }
          }
        })
      })
      .finally(() => dispatch({ type: ACTIONS.SUPP_APP_LOAD_COMPLETE }))
  },
  supplementalAppTouched: async (wasTouched) => {
    dispatch({ type: ACTIONS.STATE_UPDATED, data: { supplementalAppTouched: wasTouched } })
  },
  deleteRentalAssistance: async (idToDelete) => {
    dispatch({ type: ACTIONS.SUPP_APP_LOAD_START })
    return apiService
      .deleteRentalAssistance(idToDelete)
      .then((_) => {
        dispatch({
          type: ACTIONS.RENTAL_ASSISTANCE_DELETE_SUCCESS,
          data: { assistanceId: idToDelete }
        })
      })
      .finally(() => dispatch({ type: ACTIONS.SUPP_APP_LOAD_COMPLETE }))
  },
  openSuppAppUpdateStatusModal: (newStatus) =>
    dispatch({
      type: ACTIONS.STATUS_MODAL_UPDATED,
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
      type: ACTIONS.SHORTFORM_LOADED,
      data: {
        pageData: {
          application,
          listing,
          fileBaseUrl
        }
      }
    }),
  applicationsTableFiltersApplied: (filters) =>
    dispatch({ type: ACTIONS.APPLICATION_TABLE_FILTERS_APPLIED, data: filters || {} }),
  applicationsTablePageChanged: (page) =>
    dispatch({ type: ACTIONS.APPLICATION_TABLE_PAGE_CHANGED, data: page || 0 }),
  applicationsPageMounted: () => dispatch({ type: ACTIONS.LEFT_APPLICATION_SCOPE }),
  listingsPageMounted: () => dispatch({ type: ACTIONS.LEFT_LISTING_SCOPE }),
  applicationsPageLoadComplete: (listing) => dispatch(getListingChangedAction(listing)),
  listingRowClicked: (listing) => dispatch(getListingChangedAction(listing)),
  applicationRowClicked: (application) =>
    dispatch({
      type: ACTIONS.SELECTED_APPLICATION_CHANGED,
      data: getApplicationRowClickedBreadcrumbData(application)
    })
})
