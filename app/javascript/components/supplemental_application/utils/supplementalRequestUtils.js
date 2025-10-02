import { isEmpty, find, isEqual, reject } from 'lodash'

import apiService from 'apiService'
import Alerts from 'components/Alerts'
import { isLeaseAlreadyCreated } from 'components/supplemental_application/utils/supplementalApplicationUtils'
import { invalidateLeaseUpRelatedQueries } from 'query/hooks/useLeaseUpMutations'
import { queryClient } from 'query/queryClient'
import { convertCurrency } from 'utils/form/validations'
import { performOrDefault, performInSequence } from 'utils/promiseUtils'
import { isChanged, filterChanged } from 'utils/utils'

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

  const [{ lease, rentalAssistances }, responseApplication] = await Promise.all([
    saveLease,
    updateApplicationIfChanged
  ])

  await invalidateLeaseUpRelatedQueries({
    queryClient,
    applicationId: responseApplication?.id ?? application?.id,
    listingId:
      responseApplication?.listing?.id ?? application?.listing?.id ?? prevApplication?.listing?.id
  })

  return transformApplicationResponses(lease, responseApplication, rentalAssistances)
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
  const [lease, rentalAssistances] = await performInSequence(
    () =>
      createOrUpdateLease(
        application.lease,
        prevApplication?.lease,
        application.applicant?.id,
        application.id
      ),
    () => updateUnsavedRentalAssistances(application, prevApplication)
  )

  await invalidateLeaseUpRelatedQueries({
    queryClient,
    applicationId: application?.id,
    listingId: application?.listing?.id ?? prevApplication?.listing?.id
  })

  return {
    lease,
    rentalAssistances
  }
}

const updateUnsavedRentalAssistances = async (application, prevApplication) => {
  const rentalAssistances = reject(application.rental_assistances, isEmpty)
  const promises = []

  rentalAssistances.forEach((rentalAssistance) => {
    if (isEmpty(rentalAssistance.id)) {
      promises.push(apiService.createRentalAssistance(rentalAssistance, application.id))
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

export const deleteLease = async (application) => {
  await apiService.deleteLease(application.id, application.lease.id)
  await invalidateLeaseUpRelatedQueries({
    queryClient,
    applicationId: application?.id,
    listingId: application?.listing?.id
  })
}

export const getAMIAction = async ({ chartType, chartYear }) => {
  const response = await apiService.getAMI({ chartType, chartYear })
  if (response === false) {
    Alerts.error()
  }
  return response.ami
}

export const updatePreference = async (preferenceIndex, formApplicationValues) => {
  const preference = formApplicationValues.preferences[preferenceIndex]
  const updates = [apiService.updatePreference(preference)]
  if (preference.individual_preference === 'Rent Burdened') {
    updates.push(
      updateTotalHouseholdRent(formApplicationValues.id, formApplicationValues.total_monthly_rent)
    )
  }

  return Promise.all(updates).then((responses) => {
    const anyRequestsFailed = responses.some((r) => r === false)
    if (anyRequestsFailed) {
      return Promise.reject(Error('Updating preferences failed.'))
    }

    return invalidateLeaseUpRelatedQueries({
      queryClient,
      applicationId: formApplicationValues?.id,
      listingId: formApplicationValues?.listing?.id
    }).then(() => true)
  })
}

const updateTotalHouseholdRent = async (id, totalMonthlyRent) => {
  const attributes = convertCurrency({
    id,
    total_monthly_rent: totalMonthlyRent
  })
  return apiService.updateApplication(attributes)
}
