const toApplicationSupplementals = (applicationId) => `/applications/${applicationId}/supplementals`

const toApplication = (applicationId) => `/applications/${applicationId}`

const toApplicationEdit = (applicationId) => `/applications/${applicationId}/edit`

const toApplicationNew = (listingId) => `/listings/${listingId}/applications/new`

const toApplicationsFlagged = (id) => `/applications/flagged/${id}`

const toApplicationsFlaggedIndex = (type) => `/applications/flagged?type=${type}`

const toListingLeaseUps = (listingId) => `/listings/lease_ups/${listingId}/applications`

const toListing = (listingId) => `/listings/${listingId}`

export default {
  toApplicationSupplementals,
  toApplication,
  toApplicationsFlagged,
  toApplicationsFlaggedIndex,
  toListingLeaseUps,
  toApplicationEdit,
  toListing,
  toApplicationNew
}
