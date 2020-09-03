import apiService from '~/apiService'
import Alerts from '~/components/Alerts'
import { isEmpty, find, isEqual, reject } from 'lodash'
import { convertCurrency } from '~/utils/form/validations'
import { filterChanged } from '~/utils/utils'
import { isLeaseAlreadyCreated } from '~/utils/leaseUtils'

/**
 * Given two functions that resolve to promises, resolve them sequentially and
 * return a promise that resolves to an array of the individual promise results.
 *
 * Note that this takes two _functions_ that resolve to promises, not the promises
 * themselves. That's because once a promise is created it's already firing asyncronously.
 * @param {() => Promise)} promiseFunc1
 * @param {() => Promise} promiseFunc2
 * @return a promise that resolves to an array with
 */
const performInSequence = (promiseFunc1, promiseFunc2) =>
  promiseFunc1()
    .then(result1 =>
      promiseFunc2().then(result2 => [result1, result2]))

const transformApplicationResponses = (lease, application, rentalAssistances) => ({
  ...application,
  lease: lease,
  rental_assistances: rentalAssistances || []
})

export const updateApplication = (application, prevApplication) => {
  const primaryApplicantContact = application.applicant && application.applicant.id
  const applicationId = application['id']
  const changedFields = filterChanged(prevApplication, application)

  const leaseAndApplicationPromise = () =>
    Promise.all([
      updateOrCreateLease(application['lease'], primaryApplicantContact, applicationId),
      apiService.submitApplication(changedFields, true)
    ])

  return performInSequence(
    // Lease must be saved first before rental assistances to avoid race condition.
    leaseAndApplicationPromise,
    () => updateUnsavedRentalAssistances(application, prevApplication)
  ).then((
    [[lease, responseApplication], rentalAssistances]) =>
    transformApplicationResponses(lease, responseApplication, rentalAssistances))
}

export const createFieldUpdateComment = (data) => apiService.createFieldUpdateComment(data)

export const updateApplicationAndAddComment = (application, prevApplication, commentData) => {
  const packageResponseData = (appResponse, statusHistory) => ({
    application: appResponse,
    statusHistory
  })

  performInSequence(
    () => updateApplication(application, prevApplication),
    () => createFieldUpdateComment(commentData)
  ).then(([appResponse, statusHistory]) => packageResponseData(appResponse, statusHistory))
}

const updateUnsavedRentalAssistances = (application, prevApplication) => {
  // remove any canceled or non filled out rental assistances. i.e. {}
  const rentalAssistances = reject(application.rental_assistances, isEmpty)
  const promises = []

  rentalAssistances.forEach(rentalAssistance => {
    // update rental assistances without id (new) and changed
    if (isEmpty(rentalAssistance.id)) {
      promises.push(apiService.createRentalAssistance(rentalAssistance, application.id))
      // Only update changed rental assistances
    } else if (prevApplication && prevApplication.rental_assistances &&
      !isEqual(find(prevApplication.rental_assistances, { id: rentalAssistance.id }), rentalAssistance)) {
      promises.push(apiService.updateRentalAssistance(rentalAssistance, application.id))
    }
  })

  return Promise.all(promises)
    .then(
      // this request returns a 304 if no assistances exist, the catch makes sure it fails silently.
      apiService.getRentalAssistances(application.id)
        .catch(() => [])
    )
}

export const createLease = async (lease, primaryApplicantContact, applicationId) =>
  apiService.createLease(lease, primaryApplicantContact, applicationId)

export const updateLease = async (lease, primaryApplicantContact, applicationId) =>
  apiService.updateLease(lease, primaryApplicantContact, applicationId)

const updateOrCreateLease = (lease, primaryApplicantContact, applicationId) => {
  if (isEmpty(lease)) {
    return Promise.resolve(lease)
  }

  if (isLeaseAlreadyCreated(lease)) {
    return updateLease(lease, primaryApplicantContact, applicationId)
  } else {
    return createLease(lease, primaryApplicantContact, applicationId)
  }
}

export const getAMIAction = async ({ chartType, chartYear }) => {
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
