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

// TODO: can remove, was just for spreadsheet prototype
const updateApplication = async (data) => {
  let putData = { application: data }
  let response = await apiCall('put', '/short-form/update', putData)
  return response.result
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

export default {
  updateApplication,
  updateFlaggedApplication,
  submitApplication,
  fetchApplications,
  getAMI,
  createFieldUpdateComment
}
