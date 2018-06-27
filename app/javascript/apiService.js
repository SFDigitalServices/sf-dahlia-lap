import axios from 'axios'

const apiCall = async (method, path, data) => {
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
      Id: data.Id,
      Review_Status__c: data.Review_Status,
      Comments__c: data.Comments,
    }
  }
  let response = await apiCall('put', '/flagged-applications/update', putData)
  return response.result
}

const submitApplication = async (data) => {
  let postData = { application: data }
  return await apiCall('post', '/short-form/submit', postData)
}

const fetchApplications = async ({ page, filters }) => {
  console.log('api fetch')
  console.log(page)
  console.log(filters)
  return apiCall('get', '/applications', {
    params: {
      page,
      ...filters
    }
  })
}

// NOTE: This is used in Lease Ups Table
// const updateLeaseUpStatus = async (applicationNumer, status) => {
//   console.log(`Updating lease up status for ${applicationNumer} to ${status}`)
// }
// Creates a new Field Update Comment Salesforce record
const createLeaseUpStatus = async (data) => {
  let postData = {
    field_update_comment: {
      Processing_Status__c: data.status,
      Processing_Comment__c: data.comment,
      Application__c: data.applicationId,
    }
  }
  return await apiCall('post', '/field-update-comments/create', postData)
}

export default {
  updateApplication,
  updateFlaggedApplication,
  submitApplication,
  fetchApplications,
  createLeaseUpStatus
}
