import { request } from '~/api/request'
import { isLeaseAlreadyCreated } from './utils/leaseUtils'

const updateFlaggedApplication = async (data) => {
  let putData = {
    flagged_application: {
      id: data.id,
      review_status: data.review_status,
      comments: data.comments
    }
  }

  return request.put('/flagged-applications/update', putData)
    .then(response => response.result)
}

const submitApplication = async (application, isSupplemental = false) => {
  const requestData = { application }

  const promise = isSupplemental
    ? request.put('/short-form/submit?supplemental=true', requestData, true)
    : request.post('/short-form/submit', requestData, true)

  return promise.then(response => response.application)
}

const fetchApplications = async ({ page, filters }) =>
  request.get('/applications', {
    params: {
      page,
      ...filters
    }
  })

const fetchLeaseUpApplications = async (listingId, page, { filters }) => {
  // Fetch applications associated with a lease up listing.
  return request.get('/lease-ups/applications', {
    params: {
      listing_id: listingId,
      page: page,
      ...filters
    }
  })
}

const getAMI = async ({ chartType, chartYear }) =>
  request.get('/ami', {
    params: {
      chartType: chartType,
      year: chartYear,
      percent: 100
    }
  })

const createFieldUpdateComment = async (applicationId, status, comment, substatus) => {
  const postData = {
    field_update_comment: {
      status,
      comment,
      application: applicationId,
      ...(substatus && { substatus })
    }
  }

  return request.post('/field-update-comments/create', postData, true)
    .then(response => response.result)
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

  return request.post('/rental-assistances', postData)
}

const getRentalAssistances = async (applicationId) =>
  request.get('/rental-assistances', { params: { application_id: applicationId } }, true)
    .then((response) => response.rental_assistances)

const updateRentalAssistance = async (rentalAssistance, applicationId) => {
  const putData = {
    rental_assistance: rentalAssistance,
    application_id: applicationId
  }

  return request.put(`/rental-assistances/${rentalAssistance.id}`, putData)
}

const deleteRentalAssistance = async (rentalAssistanceId) =>
  request.destroy(`/rental-assistances/${rentalAssistanceId}`)

const getLeaseRequestData = async (rawLeaseObject, primaryApplicantContact) => {
  return {
    lease: {
      ...rawLeaseObject,
      // TODO: We should consider setting the Tenant on a Lease more explicitly
      // either via a non-interactable form element or using Salesforce
      primary_applicant_contact: primaryApplicantContact,
      // TODO: determine why lease_start_date gets removed
      lease_start_date: rawLeaseObject.lease_start_date || {}
    }
  }
}

export const updateLease = async (leaseToUpdate, primaryApplicantContact, applicationId) => {
  if (!isLeaseAlreadyCreated(leaseToUpdate)) {
    throw new Error('Trying to update a lease that doesn’t yet exist.')
  }

  const data = getLeaseRequestData(leaseToUpdate, primaryApplicantContact)

  const leaseId = leaseToUpdate['id']
  return request.put(`/applications/${applicationId}/leases/${leaseId}`, data, true)
    .then(response => response.lease)
}

export const createLease = async (leaseToCreate, primaryApplicantContact, applicationId) => {
  if (isLeaseAlreadyCreated(leaseToCreate)) {
    throw new Error('Trying to create a lease that already exists.')
  }

  const data = getLeaseRequestData(leaseToCreate, primaryApplicantContact)

  return request.post(`/applications/${applicationId}/leases`, data, true)
    .then(response => response.lease)
}

export default {
  updateApplication,
  updateFlaggedApplication,
  submitApplication,
  fetchApplications,
  fetchLeaseUpApplications,
  getAMI,
  updatePreference,
  createFieldUpdateComment,
  getRentalAssistances,
  createRentalAssistance,
  updateRentalAssistance,
  deleteRentalAssistance,
  createLease,
  updateLease
}
