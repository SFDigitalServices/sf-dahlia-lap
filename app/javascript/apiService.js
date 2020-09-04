import { request } from '~/api/request'
import { isLeaseAlreadyCreated } from './utils/leaseUtils'

const updateFlaggedApplication = (data) => {
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

const submitApplication = (application, isSupplemental = false) => {
  const requestData = { application }

  const promise = isSupplemental
    ? request.put('/short-form/submit?supplemental=true', requestData, true)
    : request.post('/short-form/submit', requestData, true)

  return promise.then(response => response.application)
}

const fetchApplications = ({ page, filters }) =>
  request.get('/applications', {
    params: {
      page,
      ...filters
    }
  })

const fetchLeaseUpApplications = (listingId, page, { filters }) => {
  // Fetch applications associated with a lease up listing.
  return request.get('/lease-ups/applications', {
    params: {
      listing_id: listingId,
      page: page,
      ...filters
    }
  })
}

const getAMI = ({ chartType, chartYear }) =>
  request.get('/ami', {
    params: {
      chartType: chartType,
      year: chartYear,
      percent: 100
    }
  })

const createFieldUpdateComment = (applicationId, status, comment, substatus) => {
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

const updatePreference = (preference) =>
  request.put(`/preferences/${preference.id}`, { preference }, true)

const updateApplication = (application) =>
  request.put(`/applications/${application.id}`, { application }, true)

const createRentalAssistance = (rentalAssistance, applicationId) => {
  const postData = {
    rental_assistance: rentalAssistance,
    application_id: applicationId
  }

  return request.post('/rental-assistances', postData)
}

const getRentalAssistances = (applicationId) =>
  request.get('/rental-assistances', { params: { application_id: applicationId } }, true)
    .then((response) => response.rental_assistances)

const updateRentalAssistance = (rentalAssistance, applicationId) => {
  const putData = {
    rental_assistance: rentalAssistance,
    application_id: applicationId
  }

  return request.put(`/rental-assistances/${rentalAssistance.id}`, putData)
}

const deleteRentalAssistance = (rentalAssistanceId) =>
  request.destroy(`/rental-assistances/${rentalAssistanceId}`)

const getLeaseRequestData = (rawLeaseObject, primaryApplicantContact) => {
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

export const updateLease = (leaseToUpdate, primaryApplicantContact, applicationId) => {
  if (!isLeaseAlreadyCreated(leaseToUpdate)) {
    throw new Error('Trying to update a lease that doesn’t yet exist.')
  }

  const data = getLeaseRequestData(leaseToUpdate, primaryApplicantContact)

  const leaseId = leaseToUpdate['id']
  return request.put(`/applications/${applicationId}/leases/${leaseId}`, data, true)
    .then(response => response.lease)
}

export const createLease = (leaseToCreate, primaryApplicantContact, applicationId) => {
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
