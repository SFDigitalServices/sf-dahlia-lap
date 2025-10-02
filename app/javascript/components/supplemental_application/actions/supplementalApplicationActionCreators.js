import { uniqBy } from 'lodash'

import { getSupplementalBreadcrumbData } from 'components/lease_ups/actions/breadcrumbActionHelpers'
import {
  getApplicationStateOverridesAfterUpdate,
  logErrorAndAlert,
  setApplicationDefaults,
  shouldSaveLeaseOnApplicationSave,
  wrapAsync
} from 'components/supplemental_application/actions/supplementalActionUtils'
import { getInitialLeaseState } from 'components/supplemental_application/utils/leaseSectionStates'
import { updateApplication } from 'components/supplemental_application/utils/supplementalRequestUtils'
import ACTIONS from 'context/actions'

const getListingAmiCharts = (units) =>
  uniqBy(units, (u) => [u.ami_chart_type, u.ami_chart_year].join())

export const loadSupplementalPageData = async (dispatch, data) =>
  dispatch({
    type: ACTIONS.SUPP_APP_INITIAL_LOAD_SUCCESS,
    data: {
      breadcrumbData: getSupplementalBreadcrumbData(data.application, data.listing),
      pageData: {
        application: setApplicationDefaults(data.application),
        units: data.units,
        fileBaseUrl: data.fileBaseUrl,
        leaseSectionState: getInitialLeaseState(data.application),
        listing: data.listing,
        listingAmiCharts: getListingAmiCharts(data.units),
        rentalAssistances: data.application.rental_assistances,
        statusHistory: data.statusHistory
      }
    }
  })

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
    (responseApplication) => ({
      type: ACTIONS.SUPP_APP_LOAD_SUCCESS,
      data: getApplicationStateOverridesAfterUpdate(leaseSectionState, responseApplication)
    }),
    logErrorAndAlert
  )
