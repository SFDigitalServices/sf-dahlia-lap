import { map } from 'lodash'
import apiService from '~/apiService'
import domainToApi from '~/components/mappers/domainToApi'
import { mapApplication } from '~/components/mappers/soqlToDomain'

export const saveApplication = async (submitType, submittedValues, application, listing, editPage) => {
  const applicationData = domainToApi.buildApplicationShape(submittedValues)
  const response = await apiService.submitApplication(applicationData)

  if (response === false) {
    window.alert('An error has occurred. Please try to save again. Contact MOHCD if you still have problems.')
    return response
  }

  if (submitType === 'Save') {
    const showAddBtn = editPage ? '' : '?showAddBtn=true'
    window.location.href = `/applications/${response.application.id}${showAddBtn}`
  } else {
    window.location.href = `/listings/${listing.id}/applications/new`
  }
  return response
}

export const fetchApplications = async (page, { filters }) => {
  const response = await apiService.fetchApplications({ page, filters })
  return {
    records: map(response.records, mapApplication),
    pages: response.pages
  }
}
