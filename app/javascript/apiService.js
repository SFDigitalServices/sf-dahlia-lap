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
  let response = await request.put('/flagged-applications/update', putData)
  return response.result
}

const submitApplication = (data, isSupplemental = false) => {
  const requestData = { application: data }

  if (isSupplemental) {
    return request.put('/short-form/submit?supplemental=true', requestData, true)
      .then(response => response.application)
      .catch(err => {
        console.log('caught error!', err)
        throw err
      })
  } else {
    return request.post('/short-form/submit', requestData, true)
      .then(response => response.application)
  }
}

const fetchApplications = async ({ page, filters }) => {
  return request.get('/applications', {
    params: {
      page,
      ...filters
    }
  })
}

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

const getAMI = async ({ chartType, chartYear }) => {
  return request.get('/ami', {
    params: {
      chartType: chartType,
      year: chartYear,
      percent: 100
    }
  })
}

const createFieldUpdateComment = async (applicationId, status, comment, substatus) => {
  let postData = {
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

const updatePreference = async (preference) => {
  const postData = {
    preference: preference
  }
  return request.put(`/preferences/${preference.id}`, postData, true)
}

const updateApplication = async (application) => {
  const postData = {
    application: application
  }
  return request.put(`/applications/${application.id}`, postData, true)
}

const createRentalAssistance = async (rentalAssistance, applicationId) => {
  const postData = {
    rental_assistance: rentalAssistance,
    application_id: applicationId
  }
  return request.post('/rental-assistances', postData)
}

const getRentalAssistances = (applicationId) =>
  request.get('/rental-assistances', { params: { application_id: applicationId } }, true)
    .then((response) => response.rental_assistances)

const updateRentalAssistance = async (rentalAssistance, applicationId) => {
  const putData = {
    rental_assistance: rentalAssistance,
    application_id: applicationId
  }
  return request.put(`/rental-assistances/${rentalAssistance.id}`, putData)
}

const deleteRentalAssistance = async (rentalAssistanceId) => {
  return request.destroy(`/rental-assistances/${rentalAssistanceId}`)
}

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
