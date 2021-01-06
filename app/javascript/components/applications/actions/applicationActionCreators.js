import { getSupplementalBreadcrumbData } from 'components/lease_ups/actions/breadcrumbActionHelpers'
import ACTIONS from 'context/actions'

export const applicationPageLoadComplete = (
  dispatch,
  application,
  fileBaseUrl,
  updateBreadcrumbs = false
) =>
  dispatch({
    type: ACTIONS.SHORTFORM_LOADED,
    data: {
      ...(updateBreadcrumbs && {
        breadcrumbData: getSupplementalBreadcrumbData(application, application?.listing)
      }),
      pageData: {
        application,
        listing: application?.listing,
        fileBaseUrl
      }
    }
  })
