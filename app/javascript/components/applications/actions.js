import apiService from '~/apiService'
import domainToApi from '~/components/mappers/domainToApi'
import { mapApplication } from '~/components/mappers/soqlToDomain'

export const saveApplication = async (submitType, submittedValues, application, listing) => {
  const applicationData = domainToApi.buildApplicationShape(submittedValues)
  const response = await apiService.submitApplication(applicationData)

  if (response === false) {
    alert('There was an error on submit. Please check values and try again.')
  }
  try {
    if (submitType === 'Save') {
      window.location.href = '/applications/' + response.application.id
    } else {
      window.location.href = '/listings/' + listing.id + '/applications/new'
    }
  } catch(err) {
    console.log('Cannot use window.location.href')
  }

  return response
}


export const fetchApplications = async (page, { filters} ) => {
  const response = await apiService.fetchApplications({ page, filters })
  return {
    records: response.records.map(mapApplication),
    pages: response.pages
  }
}
