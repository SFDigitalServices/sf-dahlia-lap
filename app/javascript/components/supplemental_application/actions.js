import apiService from '~/apiService'
import domainToApi from '~/components/mappers/domainToApi'
import Alerts from '~/components/Alerts'
import { isEmpty, find, isEqual, every } from 'lodash'

export const updateApplication = async (application, prevApplication) => {
  const primaryApplicantContact = application.applicant && application.applicant.id

  const applicationApi = domainToApi.buildApplicationShape(application)

  const initialResponses = await Promise.all([
    updateLease(application['lease'], primaryApplicantContact, application['id']),
    apiService.submitApplication(applicationApi, true)
  ])

  const rentalAssistanceResponses = await Promise.all(updateUnsavedRentalAssistances(application, prevApplication))
  let rentalAssistances = []
  if (rentalAssistanceResponses && rentalAssistanceResponses.length >= 1) {
    rentalAssistances = rentalAssistanceResponses[rentalAssistanceResponses.length - 1].rental_assistances
  }

  if (every(initialResponses, (promise) => promise !== false)) {
    const [ { lease }, { application } ] = initialResponses
    if (application) {
      application.lease = lease
      application.rental_assistances = rentalAssistances
      return application
    }
  }
  return false
}

const updateUnsavedRentalAssistances = (application, prevApplication) => {
  if (isEmpty(application.rental_assistances)) return []
  const promises = []

  application.rental_assistances.forEach(rentalAssistance => {
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
