import axios from 'axios'

const apiCall = async (method, path, data) => {
  if (process.env.NODE_ENV === 'test') { throw new Error('API should not be called in TEST') }

  try {
    const request = await axios[method](`/api/v1${path}`, data)
    return request.data
  } catch (e) {
    console.warn(e)
    return false
  }
}

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
  let response = await apiCall('put', '/flagged-applications/update', putData)
  return response.result
}

const submitApplication = async (data) => {
  let postData = { application: data }
  console.log('application data', data)
  return apiCall('post', '/short-form/submit', postData)
}

const fetchApplications = async ({ page, filters }) => {
  return apiCall('get', '/applications', {
    params: {
      page,
      ...filters
    }
  })
}

const fetchLeaseUpApplications = async (listingId, page, {filters}) => {
  // Fetch applications associated with a lease up listing.
  return apiCall('get', '/lease-ups/applications', {
    params: {
      listing_id: listingId,
      page: page,
      ...filters
    }
  })
}

const getAMI = async ({ chartType, chartYear }) => {
  return apiCall('get', '/ami', {
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
  return apiCall('post', '/field-update-comments/create', postData)
}

const updatePreference = async (data) => {
  const id = data.id
  const postData = {
    preference: data
  }
  return apiCall('put', `/preferences/${id}`, postData)
}

const updateApplication = async (data) => {
  const id = data.id
  const postData = {
    application: data
  }
  return apiCall('put', `/applications/${id}`, postData)
}

const createRentalAssistance = async (rentalAssistance, applicationId) => {
  const postData = {
    rental_assistance: rentalAssistance,
    application_id: applicationId
  }
  return apiCall('post', '/rental-assistances', postData)
}

const updateRentalAssistance = async (rentalAssistance, applicationId) => {
  const id = rentalAssistance.id
  const putData = {
    rental_assistance: rentalAssistance,
    application_id: applicationId
  }
  return apiCall('put', `/rental-assistances/${id}`, putData)
}

const deleteRentalAssistance = async (rentalAssistanceId) => {
  return apiCall('delete', `/rental-assistances/${rentalAssistanceId}`)
}

// TODO: consider just calling it create if we don't have the id, and update if we do have the id?
const createOrUpdateLease = async (lease, applicationId) => {
  const postData = {
    lease: lease,
    application_id: applicationId
  }
  return apiCall('post', `/leases`, postData)
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
