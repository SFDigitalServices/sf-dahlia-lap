import apiService from '~/apiService'
import appPaths from '~/utils/appPaths'

export const saveApplication = async (submitType, submittedValues, listing, editPage) => {
  const response = await apiService.submitApplication(submittedValues)

  if (!response) {
    window.alert(
      'An error has occurred. Please try to save again. Contact MOHCD if you still have problems.'
    )
    return response
  }

  if (submitType === 'Save') {
    window.location.href = appPaths.toApplication(response.id, !editPage)
  } else {
    window.location.href = appPaths.toApplicationNew(listing.id)
  }
  return response
}

export const fetchApplications = async (page, { filters }) => {
  const response = await apiService.fetchApplications({ page, filters })
  return {
    records: response.records,
    pages: response.pages
  }
}
