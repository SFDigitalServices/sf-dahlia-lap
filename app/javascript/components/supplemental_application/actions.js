import apiService from '~/apiService'
import domainToApi from '~/components/mappers/domainToApi'
import Alerts from '~/components/Alerts'

export const updateApplicationAction = async (application) => {
  let lease = application['lease']
  if (lease) {
    // map it right
    console.log('pre-mapped lease', lease)
    let leaseApi = domainToApi.mapLease(lease)
    console.log('post-mapped lease', leaseApi)

    // submit it
    let applicationId = application['id']
    let leaseResponse = await apiService.createOrUpdateLease(leaseApi, applicationId)
    await console.log('LEASE RESPONSE', leaseResponse)
  }
  console.log('pre-mapped application', application)
  const applicationApi = domainToApi.buildApplicationShape(application)
  console.log('post-mapped application', applicationApi)
  const applicationResponse = await apiService.submitApplication(applicationApi)
  // How to deal with error handling here?

  return applicationResponse
}

export const getAMIAction = async ({chartType, chartYear}) => {
  const response = await apiService.getAMI({ chartType, chartYear })
  if (response === false) {
    Alerts.error()
  }
  return response['ami']
}

export const updatePreference = async (preference) => {
  const response = await apiService.updatePreference(preference)
  return response
}

export const updateTotalHouseholdRent = async (id, totalMonthlyRent) => {
  const attributes = {
    id: id,
    total_monthly_rent: totalMonthlyRent
  }
  const response = await apiService.updateApplication(attributes)

  return response
}
