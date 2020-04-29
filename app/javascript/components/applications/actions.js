
import apiService from '~/apiService'

export const saveApplication = async (submitType, submittedValues, listing, editPage) => {
  const response = await apiService.submitApplication(submittedValues)

  if (!response) {
    window.alert('An error has occurred. Please try to save again. Contact MOHCD if you still have problems.')
    return response
  }

  if (submitType === 'Save') {
    const showAddBtn = editPage ? '' : '?showAddBtn=true'
    window.location.href = `/applications/${response.id}${showAddBtn}`
  } else {
    window.location.href = `/listings/${listing.id}/applications/new`
  }
  return response
}

export const fetchApplications = async (page, { filters }) => {
  const response = await apiService.fetchApplications({ page, filters })
  console.log(response)
  return {
    records: response.records,
    pages: response.pages
  }
}
