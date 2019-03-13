import apiService from '~/apiService'
import domainToApi from '~/components/mappers/domainToApi'
import Alerts from '~/components/Alerts'
import { isEmpty } from 'lodash'

export const updateApplication = async (application) => {
  const leasePromise = updateLease(application['lease'], application['id'])

  const applicationApi = domainToApi.buildApplicationShape(application)
  const appPromise = apiService.submitApplication(applicationApi)

  const [appResponse, leaseResponse] = await Promise.all([appPromise, leasePromise])
  console.log('returning with a response', appResponse, leaseResponse)
  return appResponse !== false && leaseResponse !== false
}

const updateLease = async (lease, applicationId) => {
  if (!isEmpty(lease)) {
    let leaseApi = domainToApi.mapLease(lease)
    if (lease['id']) {
      return apiService.updateLease(leaseApi, applicationId)
    } else {
      return apiService.createLease(leaseApi, applicationId)
    }
  } else {
    return true
  }
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
