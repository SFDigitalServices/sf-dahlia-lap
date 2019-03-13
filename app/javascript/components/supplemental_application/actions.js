import apiService from '~/apiService'
import domainToApi from '~/components/mappers/domainToApi'
import Alerts from '~/components/Alerts'
import { isEmpty } from 'lodash'

export const updateApplicationAction = async (application) => {
  let lease = application['lease']
  if (!isEmpty(lease)) {
    let applicationId = application['id']
    let leaseApi = domainToApi.mapLease(lease)
    await apiService.createOrUpdateLease(leaseApi, applicationId)
  }
  const applicationApi = domainToApi.buildApplicationShape(application)
  const applicationResponse = await apiService.submitApplication(applicationApi)
  // TODO: Implement error handling that checks for lease and app success #164615072
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
