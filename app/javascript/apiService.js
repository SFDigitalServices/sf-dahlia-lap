import { request } from 'api/request'

import { isLeaseAlreadyCreated } from './components/supplemental_application/utils/supplementalApplicationUtils'

const getLeaseUpListings = async () =>
  request.get('/lease-ups/listings', null, true).then((r) => r.listings)

const getLeaseUpListing = async (listingId) =>
  request.get(`/lease-ups/listings/${listingId}`, null, true).then((r) => r.listing)

const getShortFormApplication = async (applicationId) =>
  request.get(`/short-form/${applicationId}`, null, true).then((response) => ({
    application: response.application,
    fileBaseUrl: response.file_base_url
  }))

const getSupplementalApplication = async (applicationId) =>
  request
    .get(`/supplementals/${applicationId}`, null, true)
    .then(({ application, file_base_url }) => ({
      application,
      fileBaseUrl: file_base_url
    }))

const getUnits = async (listingId) =>
  request
    .get(`/supplementals/units`, { params: { listing_id: listingId } }, true)
    .then((r) => r.units)

const getStatusHistory = async (applicationId) =>
  request
    .get(`/applications/${applicationId}/field_update_comments`, null, true)
    .then(({ data }) => ({ statusHistory: data }))

const fetchFlaggedApplications = async (type) => {
  return request.get('/flagged-applications', { params: { type } }, true)
}

const fetchFlaggedApplicationsByRecordSet = (recordSetId) => {
  return request.get(`/flagged-applications/record-set/${recordSetId}`, true)
}

const updateFlaggedApplication = async (data) => {
  const putData = {
    flagged_application: {
      id: data.id,
      review_status: data.review_status,
      comments: data.comments
    }
  }

  return request
    .put('/flagged-applications/update', putData, true)
    .then((response) => response.result)
}

const submitApplication = async (application, isSupplemental = false) => {
  const requestData = { application }

  const promise = isSupplemental
    ? request.put('/short-form/submit?supplemental=true', requestData, true)
    : request.post('/short-form/submit', requestData, true)

  return promise.then((response) => response.application)
}

const fetchApplications = async ({ page, filters }) =>
  request.get(
    '/applications',
    {
      params: {
        page,
        ...filters
      }
    },
    true
  )

const fetchLeaseUpApplicationsPagination = async (listingId, page, { filters }) => {
  // Fetch applications associated with a lease up listing.
  return request.get(
    '/lease-ups/applications',
    {
      params: {
        listing_id: listingId,
        page,
        ...filters,
        pagination: true
      }
    },
    true
  )
}

const fetchApplicationsForLotteryResults = async (listingId) => {
  return request.get(`/lottery-results?listing_id=${listingId}`)
}

const fetchLotteryResults = async (listingId) => {
  return request.get(`/lottery-results?listing_id=${listingId}&lottery_results=true`)
}

const getAMI = async ({ chartType, chartYear }) =>
  request.get('/ami', {
    params: {
      chartType,
      year: chartYear,
      percent: 100
    }
  })

const getFieldUpdateComments = async (applicationId) => {
  return request
    .get(`/applications/${applicationId}/field_update_comments/`, null, true)
    .then((response) => response.data)
}

const createFieldUpdateComment = async (applicationId, status, comment, substatus) => {
  const postData = {
    field_update_comment: {
      status,
      comment,
      application: applicationId,
      ...(substatus && { substatus })
    }
  }

  return request
    .post(`/applications/${applicationId}/field_update_comments`, postData, true)
    .then((response) => response.result)
}

const updatePreference = async (preference) =>
  request.put(`/preferences/${preference.id}`, { preference }, true)

const updateApplication = async (application) =>
  request.put(`/applications/${application.id}`, { application }, true)

const createRentalAssistance = async (rentalAssistance, applicationId) => {
  const postData = {
    rental_assistance: rentalAssistance,
    application_id: applicationId
  }

  return request.post('/rental-assistances', postData, true)
}

const getRentalAssistances = async (applicationId) =>
  request
    .get('/rental-assistances', { params: { application_id: applicationId } }, true)
    .then((response) => response.rental_assistances)

const updateRentalAssistance = async (rentalAssistance, applicationId) => {
  const putData = {
    rental_assistance: rentalAssistance,
    application_id: applicationId
  }

  return request.put(`/rental-assistances/${rentalAssistance.id}`, putData, true)
}

const deleteRentalAssistance = async (rentalAssistanceId) =>
  request.destroy(`/rental-assistances/${rentalAssistanceId}`, null, true)

const getLeaseRequestData = (rawLeaseObject, primaryApplicantContact) => ({
  lease: {
    ...rawLeaseObject,
    // TODO: We should consider setting the Tenant on a Lease more explicitly
    // either via a non-interactable form element or using Salesforce
    primary_applicant_contact: primaryApplicantContact,
    // TODO: Move removing empty lease start dates to the date component.
    lease_start_date: rawLeaseObject.lease_start_date || {}
  }
})

export const getLease = async (applicationId) => {
  return request.get(`/applications/${applicationId}/leases`, null, true).then(({ lease }) => lease)
}

export const updateLease = async (leaseToUpdate, primaryApplicantContact, applicationId) => {
  if (!isLeaseAlreadyCreated(leaseToUpdate)) {
    throw new Error('Trying to update a lease that doesn’t yet exist.')
  }

  const data = getLeaseRequestData(leaseToUpdate, primaryApplicantContact)

  const leaseId = leaseToUpdate.id
  return request
    .put(`/applications/${applicationId}/leases/${leaseId}`, data, true)
    .then((response) => response.lease)
}

export const createLease = async (leaseToCreate, primaryApplicantContact, applicationId) => {
  if (isLeaseAlreadyCreated(leaseToCreate)) {
    throw new Error('Trying to create a lease that already exists.')
  }

  const data = getLeaseRequestData(leaseToCreate, primaryApplicantContact)

  return request
    .post(`/applications/${applicationId}/leases`, data, true)
    .then((response) => response.lease)
}

/**
 * Delete a lease associated with an application.
 * Additionally, delete any rental assistances associated with that lease.
 *
 * @param {Number} applicationId the application ID the lease is attached to
 * @param {Number} leaseId the lease ID to delete
 */
export const deleteLease = async (applicationId, leaseId) =>
  request.destroy(`/applications/${applicationId}/leases/${leaseId}`, null, true)

export default {
  updateApplication,
  fetchFlaggedApplications,
  fetchFlaggedApplicationsByRecordSet,
  updateFlaggedApplication,
  submitApplication,
  fetchApplications,
  fetchLeaseUpApplicationsPagination,
  getAMI,
  getUnits,
  getLease,
  getLeaseUpListing,
  getLeaseUpListings,
  getShortFormApplication,
  getStatusHistory,
  getSupplementalApplication,
  updatePreference,
  getFieldUpdateComments,
  createFieldUpdateComment,
  getRentalAssistances,
  createRentalAssistance,
  updateRentalAssistance,
  deleteRentalAssistance,
  createLease,
  deleteLease,
  updateLease,
  fetchApplicationsForLotteryResults,
  fetchLotteryResults
}
