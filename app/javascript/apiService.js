import request from '~/api/request'

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
  let response = await request.apiCall('put', '/flagged-applications/update', putData)
  return response.result
}

const submitApplication = async (data) => {
  let postData = { application: data }
  return request.apiCall('post', '/short-form/submit', postData)
}

const fetchApplications = async ({ page, filters }) => {
  return request.apiCall('get', '/applications', {
    params: {
      page,
      ...filters
    }
  })
}

const fetchLeaseUpApplications = async (listingId, page, {filters}) => {
  // Fetch applications associated with a lease up listing.
  return request.apiCall('get', '/lease-ups/applications', {
    params: {
      listing_id: listingId,
      page: page,
      ...filters
    }
  })
}

const getAMI = async ({ chartType, chartYear }) => {
  return request.apiCall('get', '/ami', {
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
      Application__c: data.applicationId
    }
  }
  return request.apiCall('post', '/field-update-comments/create', postData)
}

const updatePreference = async (data) => {
  const postData = {
    preference: data
  }
  return request.apiCall('put', `/preferences/${data.id}`, postData)
}

const updateApplication = async (data) => {
  const postData = {
    application: data
  }
  return request.apiCall('put', `/applications/${data.id}`, postData)
}

const createRentalAssistance = async (rentalAssistance, applicationId) => {
  const postData = {
    rental_assistance: rentalAssistance,
    application_id: applicationId
  }
  return request.apiCall('post', '/rental-assistances', postData)
}

const updateRentalAssistance = async (rentalAssistance, applicationId) => {
  const putData = {
    rental_assistance: rentalAssistance,
    application_id: applicationId
  }
  return request.apiCall('put', `/rental-assistances/${rentalAssistance.id}`, putData)
}

const deleteRentalAssistance = async (rentalAssistanceId) => {
  return request.apiCall('delete', `/rental-assistances/${rentalAssistanceId}`)
}

export const createOrUpdateLease = async (lease, applicationId) => {
  const leaseId = lease['id']
  const data = {
    lease: lease
  }
  if (leaseId) {
    return request.apiCall('put', `/applications/${applicationId}/leases/${leaseId}`, data)
  } else {
    return request.apiCall('post', `/applications/${applicationId}/leases`, data)
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
  createRentalAssistance,
  updateRentalAssistance,
  deleteRentalAssistance,
  createOrUpdateLease
}
