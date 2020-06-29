import apiService from '~/apiService'
import Alerts from '~/components/Alerts'
import { isEmpty, find, isEqual, every, reject, forEach, isPlainObject } from 'lodash'
import { convertCurrency } from '~/utils/form/validations'

const filterChanged = (prev, current) => {
  const changedFields = {}
  forEach(current, (value, key) => {
    if (!isEqual(prev[key], value)) {
      if (isPlainObject(value)) {
        const obj = filterChanged(prev[key], value)
        if (!isEmpty(obj)) {
          obj['id'] = value.id
          changedFields[key] = obj
        }
      } else {
        changedFields[key] = value
      }
    }
  })
  return changedFields
}

export const updateApplication = async (application, prevApplication) => {
  const primaryApplicantContact = application.applicant && application.applicant.id
  const applicationId = application['id']
  const changedFields = filterChanged(prevApplication, application)
  changedFields['id'] = application['id']

  // await lease and base application updates first
  const initialResponses = await Promise.all([
    updateLease(application['lease'], primaryApplicantContact, applicationId),
    apiService.submitApplication(changedFields, true)
  ])
  // next we update rental assistances if applicable
  await Promise.all(updateUnsavedRentalAssistances(application, prevApplication))
  // then retrieve all rental assistances together instead of on each create/update
  const rentalAssistances = await apiService.getRentalAssistances(applicationId)
  // then combine our responses to rebuild the structure in the UI
  if (every(initialResponses, (promise) => promise !== false)) {
    const [lease, application] = initialResponses
    if (application) {
      application.lease = lease
      application.rental_assistances = rentalAssistances || []
      return application
    }
  }
  return false
}

const updateUnsavedRentalAssistances = (application, prevApplication) => {
  // remove any canceled or non filled out rental assistances. i.e. {}
  const rentalAssistances = reject(application.rental_assistances, isEmpty)
  if (isEmpty(rentalAssistances)) return []
  const promises = []

  rentalAssistances.forEach(rentalAssistance => {
    // update rental assistances without id (new) and changed
    if (isEmpty(rentalAssistance.id)) {
      promises.push(apiService.createRentalAssistance(rentalAssistance, application.id))
      // Only update changed rental assistances
    } else if (prevApplication && prevApplication.rental_assistances &&
      !isEqual(find(prevApplication.rental_assistances, {id: rentalAssistance.id}), rentalAssistance)) {
      promises.push(apiService.updateRentalAssistance(rentalAssistance, application.id))
    }
  })
  // if no promises have been pushed then we are not updating
  // anything but already have the data we need so return the assistances
  if (promises.length === 0) {
    return [Promise.resolve({rental_assistances: rentalAssistances})]
  }

  return promises
}

const updateLease = async (lease, primaryApplicantContact, applicationId) => {
  if (!isEmpty(lease)) {
    // TODO: We should consider setting the Tenant on a Lease more explicitly
    // either via a non-interactable form element or using Salesforce
    lease['primary_applicant_contact'] = primaryApplicantContact
    const newOrUpdatedLease = await apiService.createOrUpdateLease(lease, applicationId)
    return newOrUpdatedLease
  } else {
    return lease
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
  const attributes = convertCurrency({
    id: id,
    total_monthly_rent: totalMonthlyRent
  })
  const response = await apiService.updateApplication(attributes)

  return response
}
