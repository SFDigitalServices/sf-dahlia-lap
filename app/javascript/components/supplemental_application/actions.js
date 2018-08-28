import apiService from '~/apiService'
import domainToApi from '~/components/mappers/domainToApi'
import Alerts from '~/components/Alerts'

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