import apiService from '~/apiService'
import domainToApi from '~/components/mappers/domainToApi'

export const saveApplication = async (submitType, submittedValues, application, listing) => {
  // const applicationData = prepareApplicationData(submittedValues, application, listing)
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
