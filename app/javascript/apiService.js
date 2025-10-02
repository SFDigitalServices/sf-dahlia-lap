import { request } from 'api/request'

import { isLeaseAlreadyCreated } from './components/supplemental_application/utils/supplementalApplicationUtils'

const getLeaseUpListings = async () => {
  const response = await request.get('/lease-ups/listings', null, true)
  return response.listings
}

const getLeaseUpListing = async (listingId) => {
  const response = await request.get(`/lease-ups/listings/${listingId}`, null, true)
  return response.listing
}

const getShortFormApplication = async (applicationId) => {
  const response = await request.get(`/short-form/${applicationId}`, null, true)
  return {
    application: response.application,
    fileBaseUrl: response.file_base_url
  }
}

const getSupplementalApplication = async (applicationId) => {
  const response = await request.get(`/supplementals/${applicationId}`, null, true)
  return {
    application: response.application,
    fileBaseUrl: response.file_base_url
  }
}

const getUnits = async (listingId) => {
  const response = await request.get(
    '/supplementals/units',
    { params: { listing_id: listingId } },
    true
  )
  return response.units
}

const getStatusHistory = async (applicationId) => {
  const response = await request.get(
    `/applications/${applicationId}/field_update_comments`,
    null,
    true
  )
  return {
    statusHistory: response.data
  }
}

const fetchFlaggedApplications = async (type) => {
  const response = await request.get('/flagged-applications', { params: { type } }, true)
  return response
}

const fetchFlaggedApplicationsByRecordSet = async (recordSetId) => {
  const response = await request.get(`/flagged-applications/record-set/${recordSetId}`, true)
  return response
}

const updateFlaggedApplication = async (data) => {
  const putData = {
    flagged_application: {
      id: data.id,
      review_status: data.review_status,
      comments: data.comments
    }
  }

  const response = await request.put('/flagged-applications/update', putData, true)
  return response.result
}

const submitApplication = async (application, isSupplemental = false) => {
  const requestData = { application }

  const response = isSupplemental
    ? await request.put('/short-form/submit?supplemental=true', requestData, true)
    : await request.post('/short-form/submit', requestData, true)

  return response.application
}

const fetchApplications = async ({ page, filters }) => {
  const response = await request.get(
    '/applications',
    {
      params: {
        page,
        ...filters
      }
    },
    true
  )
  return response
}

const fetchLeaseUpApplicationsPagination = async (listingId, page, { filters }) => {
  const response = await request.get(
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
  return response
}

const fetchApplicationsForLotteryResults = async (listingId) => {
  return request.get(`/lottery-results?listing_id=${listingId}`)
}

const fetchLotteryResults = async (listingId) => {
  return request.get(`/lottery-results?listing_id=${listingId}&use_lottery_result_api=true`)
}

const getAMI = async ({ chartType, chartYear }) => {
  return request.get('/ami', {
    params: {
      chartType,
      year: chartYear,
      percent: 100
    }
  })
}

const getFieldUpdateComments = async (applicationId) => {
  const response = await request.get(
    `/applications/${applicationId}/field_update_comments/`,
    null,
    true
  )
  return response.data
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

  const response = await request.post(
    `/applications/${applicationId}/field_update_comments`,
    postData,
    true
  )
  return response.result
}

const updatePreference = async (preference) => {
  return request.put(`/preferences/${preference.id}`, { preference }, true)
}

const updateApplication = async (application) => {
  return request.put(`/applications/${application.id}`, { application }, true)
}

const createRentalAssistance = async (rentalAssistance, applicationId) => {
  const postData = {
    rental_assistance: rentalAssistance,
    application_id: applicationId
  }

  return request.post('/rental-assistances', postData, true)
}

const getRentalAssistances = async (applicationId) => {
  const response = await request.get(
    '/rental-assistances',
    { params: { application_id: applicationId } },
    true
  )
  return response.rental_assistances
}

const updateRentalAssistance = async (rentalAssistance, applicationId) => {
  const putData = {
    rental_assistance: rentalAssistance,
    application_id: applicationId
  }

  return request.put(`/rental-assistances/${rentalAssistance.id}`, putData, true)
}

const deleteRentalAssistance = async (rentalAssistanceId) => {
  return request.destroy(`/rental-assistances/${rentalAssistanceId}`, null, true)
}

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

const getLease = async (applicationId) => {
  const response = await request.get(`/applications/${applicationId}/leases`, null, true)
  return response.lease
}

const updateLease = async (leaseToUpdate, primaryApplicantContact, applicationId) => {
  if (!isLeaseAlreadyCreated(leaseToUpdate)) {
    throw new Error('Trying to update a lease that doesn’t yet exist.')
  }

  const data = getLeaseRequestData(leaseToUpdate, primaryApplicantContact)
  const leaseId = leaseToUpdate.id
  const response = await request.put(`/applications/${applicationId}/leases/${leaseId}`, data, true)
  return response.lease
}

const createLease = async (leaseToCreate, primaryApplicantContact, applicationId) => {
  if (isLeaseAlreadyCreated(leaseToCreate)) {
    throw new Error('Trying to create a lease that already exists.')
  }

  const data = getLeaseRequestData(leaseToCreate, primaryApplicantContact)
  const response = await request.post(`/applications/${applicationId}/leases`, data, true)
  return response.lease
}

/**
 * Delete a lease associated with an application.
 * Additionally, delete any rental assistances associated with that lease.
 *
 * @param {Number} applicationId the application ID the lease is attached to
 * @param {Number} leaseId the lease ID to delete
 */
const deleteLease = async (applicationId, leaseId) => {
  return request.destroy(`/applications/${applicationId}/leases/${leaseId}`, null, true)
}

const apiService = {
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

export {
  getLeaseUpListings,
  getLeaseUpListing,
  getShortFormApplication,
  getSupplementalApplication,
  getUnits,
  getStatusHistory,
  fetchFlaggedApplications,
  fetchFlaggedApplicationsByRecordSet,
  updateFlaggedApplication,
  submitApplication,
  fetchApplications,
  fetchLeaseUpApplicationsPagination,
  fetchApplicationsForLotteryResults,
  fetchLotteryResults,
  getAMI,
  getFieldUpdateComments,
  createFieldUpdateComment,
  updatePreference,
  updateApplication,
  createRentalAssistance,
  getRentalAssistances,
  updateRentalAssistance,
  deleteRentalAssistance,
  getLease,
  updateLease,
  createLease,
  deleteLease
}

export default apiService
