const toApplicationSupplementals = (applicationId) => `/applications/${applicationId}/supplementals`

const toApplication = (applicationId) => `/applications/${applicationId}`

const toApplicationEdit = (applicationId) => `/applications/${applicationId}/edit`

const toApplicationsFlagged = (id) => `/applications/flagged/${id}`

const toApplicationsFlaggedIndex = (type) => `/applications/flagged?type=${type}`

const toListingLeaseUps = (listingId) => `/listings/lease_ups/${listingId}/applications`

const toListing = (listingId) => `/listings/${listingId}`

const toLeaseUpApplications = (listingId) => `/listings/lease_ups/${listingId}/applications`

export default {
  toApplicationSupplementals,
  toApplication,
  toApplicationsFlagged,
  toApplicationsFlaggedIndex,
  toListingLeaseUps,
  toApplicationEdit,
  toListing,
  toLeaseUpApplications
}
