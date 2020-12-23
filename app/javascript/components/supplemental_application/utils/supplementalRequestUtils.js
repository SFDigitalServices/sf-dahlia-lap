import { isEmpty, find, isEqual, reject } from 'lodash'

import apiService from 'apiService'
import Alerts from 'components/Alerts'
import { isLeaseAlreadyCreated } from 'components/supplemental_application/utils/supplementalApplicationUtils'
import { convertCurrency } from 'utils/form/validations'
import { performOrDefault, performInSequence } from 'utils/promiseUtils'
import { isChanged, filterChanged } from 'utils/utils'

/**
 * Combine lease, application, and rental assistances responses into a single
 * application object.
 */
const transformApplicationResponses = (lease, application, rentalAssistances) => ({
  ...application,
  lease,
  rental_assistances: rentalAssistances || []
})

const defaultLeaseResponse = (application) => ({
  lease: application?.lease,
  rentalAssistances: application?.rental_assistances
})

export const getSupplementalPageData = async (applicationId, listingId = null) => {
  const applicationPromise = async () => apiService.getSupplementalApplication(applicationId)
  const unitsPromise = async (nonNullListingId) => apiService.getUnits(nonNullListingId)
  const listingPromise = async (nonNullListingId) => apiService.getLeaseUpListing(nonNullListingId)
  const listingAndUnitsPromise = async (nonNullListingId) =>
    Promise.all([unitsPromise(nonNullListingId), listingPromise(nonNullListingId)])
  const applicationAndUnitsPromise = async () => {
    const inParallelPromiseFunc = async () =>
      Promise.all([applicationPromise(), listingAndUnitsPromise(listingId)])
    const inSequencePromiseFunc = async () =>
      performInSequence(applicationPromise, (res) =>
        listingAndUnitsPromise(res.application.listing.id)
      )

    const promiseFunc = listingId ? inParallelPromiseFunc : inSequencePromiseFunc

    return promiseFunc().then(([{ application, fileBaseUrl }, [units, listing]]) => ({
      application,
      fileBaseUrl,
      units,
      listing
    }))
  }

  const rentalAssistancesPromise = () => apiService.getRentalAssistances(applicationId)
  const statusHistoryPromise = () => apiService.getStatusHistory(applicationId)
  const leasePromise = () => apiService.getLease(applicationId)

  return Promise.all([
    statusHistoryPromise(),
    leasePromise(),
    rentalAssistancesPromise(),
    applicationAndUnitsPromise()
  ]).then(
    async ([
      { statusHistory },
      lease,
      rentalAssistances,
      { application, fileBaseUrl, units, listing }
    ]) => ({
      application: { ...application, lease, rental_assistances: rentalAssistances },
      statusHistory,
      fileBaseUrl,
      units,
      listing
    })
  )
}

/**
 * Update any fields on the application that have been changed from
 * prevApplication. This action triggers multiple separate requests:
 * 1. An application update request
 * 2. A lease create or update request
 * 3. Multiple rental assistance create/update requests
 * 4. A rental assistance get request
 */
export const updateApplication = async (application, prevApplication, alsoSaveLease) => {
  const changedFields = filterChanged(prevApplication, application)
  const isApplicationChanged = isChanged(prevApplication, application)

  const updateApplicationIfChanged = performOrDefault(
    isApplicationChanged,
    () => apiService.submitApplication(changedFields, true),
    application
  )

  const saveLease = performOrDefault(
    alsoSaveLease,
    () => saveLeaseAndAssistances(application, prevApplication),
    defaultLeaseResponse(prevApplication)
  )

  return Promise.all([saveLease, updateApplicationIfChanged]).then(
    ([{ lease, rentalAssistances }, responseApplication]) => {
      return transformApplicationResponses(lease, responseApplication, rentalAssistances)
    }
  )
}

export const createFieldUpdateComment = async (applicationId, status, comment, substatus) => {
  return apiService.createFieldUpdateComment(applicationId, status, comment, substatus)
}

export const updateApplicationAndAddComment = async (
  application,
  prevApplication,
  status,
  comment,
  substatus,
  alsoSaveLease
) => {
  const packageResponseData = (appResponse, statusHistory) => ({
    application: appResponse,
    statusHistory
  })

  return performInSequence(
    () => updateApplication(application, prevApplication, alsoSaveLease),
    () => createFieldUpdateComment(prevApplication.id, status, comment, substatus)
  ).then(([appResponse, statusHistory]) => packageResponseData(appResponse, statusHistory))
}

export const saveLeaseAndAssistances = async (application, prevApplication) => {
  return performInSequence(
    () =>
      createOrUpdateLease(
        application.lease,
        prevApplication?.lease,
        application.applicant?.id,
        application.id
      ),
    () => updateUnsavedRentalAssistances(application, prevApplication)
  ).then(([lease, rentalAssistances]) => ({
    lease,
    rentalAssistances
  }))
}

const updateUnsavedRentalAssistances = async (application, prevApplication) => {
  // remove any canceled or non filled out rental assistances. i.e. {}
  const rentalAssistances = reject(application.rental_assistances, isEmpty)
  const promises = []

  rentalAssistances.forEach((rentalAssistance) => {
    // update rental assistances without id (new) and changed
    if (isEmpty(rentalAssistance.id)) {
      promises.push(apiService.createRentalAssistance(rentalAssistance, application.id))
      // Only update changed rental assistances
    } else if (
      prevApplication &&
      prevApplication.rental_assistances &&
      !isEqual(
        find(prevApplication.rental_assistances, { id: rentalAssistance.id }),
        rentalAssistance
      )
    ) {
      promises.push(apiService.updateRentalAssistance(rentalAssistance, application.id))
    }
  })

  return performOrDefault(
    !isEmpty(promises),
    () => Promise.all(promises).then(() => apiService.getRentalAssistances(application.id)),
    rentalAssistances
  )
}

const createOrUpdateLease = async (lease, prevLease, primaryApplicantContactId, applicationId) => {
  const isNewLease = !isLeaseAlreadyCreated(lease)

  const saveLeasePromise = isNewLease
    ? () => apiService.createLease(lease, primaryApplicantContactId, applicationId)
    : () => apiService.updateLease(lease, primaryApplicantContactId, applicationId)

  const isNewOrChangedLease = isNewLease || isChanged(prevLease, lease)
  return performOrDefault(isNewOrChangedLease, saveLeasePromise, lease)
}

/**
 * Delete a lease associated with an application.
 * Additionally, delete any rental assistances associated with that lease.
 *
 * @param {Number} application the application object (must contain a lease)
 */
export const deleteLease = async (application) =>
  apiService.deleteLease(application.id, application.lease.id)

export const getAMIAction = async ({ chartType, chartYear }) => {
  const response = await apiService.getAMI({ chartType, chartYear })
  if (response === false) {
    Alerts.error()
  }
  return response.ami
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
  return apiService.updateApplication(attributes)
}
