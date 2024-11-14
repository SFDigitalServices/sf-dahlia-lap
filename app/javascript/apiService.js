import { request } from 'api/request'
import { buildLeaseUpApplicationsParams } from 'components/lease_ups/utils/leaseUpRequestUtils'
import { LISTING_TYPE_FIRST_COME_FIRST_SERVED } from 'utils/consts'

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

/**
 * @deprecated in favor of fetchLeaseUpApplicationsPagination
 */
const fetchLeaseUpApplications = async (
  listingId,
  page,
  { filters },
  includeGeneralApps = true,
  getAll
) => {
  const generalApps = {
    records: [],
    pages: 0
  }

  // Fetch application preferences associated with a lease up listing.
  const appPrefs = await getLeaseUpApplications(listingId, filters, false, getAll)

  // don't need to include general applications for first come fist served listings
  // or when getting applications for layered preferences
  // or when there are more than 2000 records in the preference response (right now, we don't need to show more than 2000 records)
  if (
    appPrefs.records.length < 2000 &&
    appPrefs.listing_type !== LISTING_TYPE_FIRST_COME_FIRST_SERVED &&
    includeGeneralApps
  ) {
    // Fetch general applications associated with a lease up listing.
    const generalAppsResponse = await getLeaseUpApplications(listingId, filters, true)
    generalApps.records = generalAppsResponse.records
    generalApps.pages = generalAppsResponse.pages
  }

  return {
    records: [...appPrefs.records, ...generalApps.records],
    pages: appPrefs.pages + generalApps.pages,
    listing_type: appPrefs.listing_type
  }
}

/** @deprecated */
const getLeaseUpApplications = async (listingId, filters, general = false, getAll = false) => {
  const applications = []
  let pages
  let listingType
  let lastPref

  // we stop when we've retrieved 50000 records so that we don't accidentally loop forever if there is an error
  while (applications.length < 50000) {
    const response = await request.get(
      '/lease-ups/applications',
      {
        params: buildLeaseUpApplicationsParams(listingId, filters, lastPref, general)
      },
      true
    )

    lastPref = response.records[response.records.length - 1]

    // We want to use the pages from the first call because it has all the pages
    if (!pages) {
      pages = response.pages
      listingType = response.listing_type
    }

    applications.push(...response.records)

    if (!getAll || response.total_size < 2000) {
      break
    }
  }

  return { records: applications, pages, listing_type: listingType }
}

const fetchApplicationsForLotteryResults = async (listingId) => {
  return request.get(`/lottery-results?listing_id=${listingId}`)
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
  fetchLeaseUpApplications,
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
  fetchApplicationsForLotteryResults
}
