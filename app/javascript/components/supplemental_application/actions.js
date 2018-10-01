import apiService from '~/apiService'
import domainToApi from '~/components/mappers/domainToApi'
import Alerts from '~/components/Alerts'
import { mapApplicationPreference } from '~/components/mappers/domainToSoql/application_preference'

export const updateApplicationAction = async (application) => {
  const applicationApi = domainToApi.buildApplicationShape(application)
  const response = await apiService.submitApplication(applicationApi)
  if (response === false) {
    Alerts.error()
  }
  return response
}

export const getAMIAction = async ({chartType, chartYear}) => {
  const response = await apiService.getAMI({chartType, chartYear})
  if (response === false) {
    Alerts.error()
  }
  return response['ami']
}

export const updatePreference = async (preference) => {
  const soqlPreference = mapApplicationPreference(preference)
  const response = await apiService.updatePreference(soqlPreference)

  if (response === false) {
    Alerts.error()
  }

  return response
}

export const updateTotalHouseholdRent = async (id, totalMonthlyRent) => {
  const attributes = {
    Total_Monthly_Rent__c: totalMonthlyRent
  }
  const response = await apiService.updateApplicationOnly(id, attributes)

  return response
}
