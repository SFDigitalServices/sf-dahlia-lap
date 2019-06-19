import apiService from '~/apiService'
import domainToApi from '~/components/mappers/domainToApi'
import Alerts from '~/components/Alerts'
import { isEmpty, find, isEqual, every } from 'lodash'
import { currencyToFloat } from '~/utils/utils'

export const updateApplication = async (application, prevApplication) => {
  const promises = [updateLease(application['lease'], application['primaryApplicantContact'], application['id'])]

  // Conctact lease promise with rental assistances
  promises.concat(updateRentalAssistances(application, prevApplication))
  const applicationApi = domainToApi.buildApplicationShape(application)
  promises.push(apiService.submitApplication(applicationApi))
  const responses = await Promise.all(promises)

  return every(responses, (promise) => promise !== false)
}

const updateRentalAssistances = (application, prevApplication) => {
  if (isEmpty(application.rental_assistances)) return []
  const promises = []

  application.rental_assistances.forEach(rentalAssistance => {
    // Salesforce does not accept currency strings. TODO: Move this into the form
    rentalAssistance['assistance_amount'] = currencyToFloat(rentalAssistance['assistance_amount'])
    // update rental assistances without id (new) and changed
    if (isEmpty(rentalAssistance.id)) {
      promises.push(apiService.createRentalAssistance(rentalAssistance, application.id))
      // Only update changed rental assistances
    } else if (prevApplication && prevApplication.rental_assistances &&
      !isEqual(find(prevApplication.rental_assistances, {id: rentalAssistance.id}), rentalAssistance)) {
      promises.push(apiService.updateRentalAssistance(rentalAssistance, application.id))
    }
  })
  return promises
}

const updateLease = async (lease, primaryApplicantContact, applicationId) => {
  if (!isEmpty(lease)) {
    let leaseApi = domainToApi.mapLease(lease)
    // TODO: We should consider setting the Tenant on a Lease more explicitly
    // either via a non-interactable form element or using Salesforce
    leaseApi['primary_applicant_contact'] = primaryApplicantContact
    return apiService.createOrUpdateLease(leaseApi, applicationId)
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
