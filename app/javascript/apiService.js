import { request } from '~/api/request'

const updateFlaggedApplication = async (data) => {
  let putData = {
    flagged_application: {
      // these are the only fields we're interested in for the update method
      // have to reformat them back into salesforce-friendly terms
      Id: data.id,
      Review_Status__c: data.review_status,
      Comments__c: data.comments
    }
  }
  let response = await request.put('/flagged-applications/update', putData)
  return response.result
}

const submitApplication = async (data, isSupplemental = false) => {
  let postData = { application: data }
  const { application } = await request.post(`/short-form/submit${isSupplemental ? '?supplemental=true' : ''}`, postData)
  return application
}

const fetchApplications = async ({ page, filters }) => {
  return request.get('/applications', {
    params: {
      page,
      ...filters
    }
  })
}

const fetchLeaseUpApplications = async (listingId, page, {filters}) => {
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

const createFieldUpdateComment = async (data) => {
  let postData = {
    field_update_comment: {
      Processing_Status__c: data.status,
      Processing_Comment__c: data.comment,
      Application__c: data.applicationId,
      ...(data.subStatus ? { Sub_Status__c: data.subStatus } : {})
    }
  }
  const { result } = await request.post('/field-update-comments/create', postData)
  return result
}

const updatePreference = async (preference) => {
  const postData = {
    preference: preference
  }
  return request.put(`/preferences/${preference.id}`, postData)
}

const updateApplication = async (application) => {
  const postData = {
    application: application
  }
  return request.put(`/applications/${application.id}`, postData)
}

const createRentalAssistance = async (rentalAssistance, applicationId) => {
  const postData = {
    rental_assistance: rentalAssistance,
    application_id: applicationId
  }
  return request.post('/rental-assistances', postData)
}

const getRentalAssistances = async (applicationId) => {
  const { rental_assistances: rentalAssistances } = await request.get('/rental-assistances', { params: { application_id: applicationId } })
  return rentalAssistances
}

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

export const createOrUpdateLease = async (leaseToCreateOrUpdate, applicationId) => {
  const leaseId = leaseToCreateOrUpdate['id']
  const data = { lease: leaseToCreateOrUpdate }
  if (leaseId) {
    const { lease } = await request.put(`/applications/${applicationId}/leases/${leaseId}`, data)
    return lease
  } else {
    const { lease } = await request.post(`/applications/${applicationId}/leases`, data)
    return lease
  }
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
  createOrUpdateLease
}
