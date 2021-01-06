import { uniqBy } from 'lodash'

import { getSupplementalBreadcrumbData } from 'components/lease_ups/actions/breadcrumbActionHelpers'
import { preferenceSaveSuccess } from 'components/supplemental_application/actions/preferenceActionCreators'
import {
  getApplicationStateOverridesAfterUpdate,
  logErrorAndAlert,
  setApplicationDefaults,
  shouldSaveLeaseOnApplicationSave,
  wrapAsync
} from 'components/supplemental_application/actions/supplementalActionUtils'
import { getInitialLeaseState } from 'components/supplemental_application/utils/leaseSectionStates'
import {
  getSupplementalPageData,
  updateApplication
} from 'components/supplemental_application/utils/supplementalRequestUtils'
import ACTIONS from 'context/actions'

const getListingAmiCharts = (units) =>
  uniqBy(units, (u) => [u.ami_chart_type, u.ami_chart_year].join())

export const loadSupplementalPageData = async (dispatch, applicationId, listingId = null) =>
  wrapAsync(
    dispatch,
    () => getSupplementalPageData(applicationId, listingId),
    ({ application, statusHistory, fileBaseUrl, units, listing }) => ({
      type: ACTIONS.SUPP_APP_INITIAL_LOAD_SUCCESS,
      data: {
        breadcrumbData: getSupplementalBreadcrumbData(application, listing),
        pageData: {
          application: setApplicationDefaults(application),
          units,
          fileBaseUrl,
          // Only show lease section on load if there's a lease on the application.
          leaseSectionState: getInitialLeaseState(application),
          listing: listing,
          listingAmiCharts: getListingAmiCharts(units),
          rentalAssistances: application.rental_assistances,
          statusHistory
        }
      }
    }),
    logErrorAndAlert
  )

export const updateSupplementalApplication = async (
  dispatch,
  leaseSectionState,
  formApplication,
  prevApplication
) =>
  wrapAsync(
    dispatch,
    () =>
      updateApplication(
        formApplication,
        prevApplication,
        shouldSaveLeaseOnApplicationSave(leaseSectionState)
      ),
    (responseApplication) => {
      preferenceSaveSuccess(dispatch)
      return {
        type: ACTIONS.SUPP_APP_LOAD_SUCCESS,
        data: getApplicationStateOverridesAfterUpdate(leaseSectionState, responseApplication)
      }
    },
    logErrorAndAlert
  )
