import apiService from '~/apiService'
import Alerts from '~/components/Alerts'
import { isEmpty, find, isEqual, reject } from 'lodash'
import { convertCurrency } from '~/utils/form/validations'
import { filterChanged } from '~/utils/utils'
import { isLeaseAlreadyCreated } from '~/utils/leaseUtils'
import { performInSequence } from '~/utils/promiseUtils'

/**
 * Combine lease, application, and rental assistances responses into a single
 * application object.
 */
const transformApplicationResponses = (lease, application, rentalAssistances) => ({
  ...application,
  lease,
  rental_assistances: rentalAssistances || []
})

/**
 * Update any fields on the application that have been changed from
 * prevApplication. This action triggers multiple separate requests:
 * 1. An application update request
 * 2. A lease create or update request
 * 3. Multiple rental assistance create/update requests
 * 4. A rental assistance get request
 *
 * TODO: Don't create an empty lease in this function.
 */
export const updateApplication = async (application, prevApplication) => {
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
  ).then(([[lease, responseApplication], rentalAssistances]) =>
    transformApplicationResponses(lease, responseApplication, rentalAssistances))
}

export const createFieldUpdateComment = async (applicationId, status, comment, substatus) =>
  apiService.createFieldUpdateComment(applicationId, status, comment, substatus)

export const updateApplicationAndAddComment = async (application, prevApplication, status, comment, substatus) => {
  const packageResponseData = (appResponse, statusHistory) => ({
    application: appResponse,
    statusHistory
  })

  return performInSequence(
    () => updateApplication(application, prevApplication),
    () => createFieldUpdateComment(prevApplication.id, status, comment, substatus)
  ).then(([appResponse, statusHistory]) => packageResponseData(appResponse, statusHistory))
}

const updateUnsavedRentalAssistances = async (application, prevApplication) => {
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
    .then(() => apiService.getRentalAssistances(application.id))
}

export const createLease = async (lease, primaryApplicantContact, applicationId) =>
  apiService.createLease(lease, primaryApplicantContact, applicationId)

export const updateLease = async (lease, primaryApplicantContact, applicationId) =>
  apiService.updateLease(lease, primaryApplicantContact, applicationId)

export const updateOrCreateLease = async (lease, primaryApplicantContact, applicationId) => {
  if (isEmpty(lease)) {
    return lease
  }

  if (isLeaseAlreadyCreated(lease)) {
    return updateLease(lease, primaryApplicantContact, applicationId)
  } else {
    return createLease(lease, primaryApplicantContact, applicationId)
  }
}

export const deleteLease = async (lease) => {
  console.log('deleting lease')
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
