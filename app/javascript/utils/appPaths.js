const toApplication = (applicationId, showAddBtn = false) => {
  const queryParams = showAddBtn ? '?showAddBtn=true' : ''

  return `/applications/${applicationId}${queryParams}`
}

const toListings = () => '/listings'

const toLeaseUpApplication = (applicationId) => `/lease-ups/applications/${applicationId}`

const toApplicationEdit = (applicationId) => `/applications/${applicationId}/edit`

const toApplications = (listingId) => `/listings/${listingId}/applications`

const toApplicationNew = (listingId) => `/listings/${listingId}/applications/new`

const toApplicationsFlagged = (id) => `/applications/flagged/${id}`

const toApplicationsFlaggedIndexBase = () => '/applications/flagged'

const toApplicationsFlaggedIndex = (type) => `${toApplicationsFlaggedIndexBase()}?type=${type}`

const toListingLeaseUps = (listingId) => `/lease-ups/listings/${listingId}`

const toLotteryResults = (listingId) => `/lease-ups/listings/${listingId}/lottery-results`

const toListing = (listingId) => `/listings/${listingId}`

const toLeaseUps = () => '/lease-ups/listings'

const toLeaseUpApplications = (listingId) => `/lease-ups/listings/${listingId}`

const toAttachmentDownload = (fileBaseUrl, file) => {
  switch (file.file_type) {
    case 'Attachment':
      return `${fileBaseUrl}/servlet/servlet.FileDownload?file=${file.id}`
    case 'File':
      return `${fileBaseUrl}/sfc/servlet.shepherd/version/download/${file.id}`
    default:
      return null
  }
}

export default {
  toApplication,
  toApplications,
  toLeaseUpApplication,
  toApplicationsFlagged,
  toApplicationsFlaggedIndex,
  toApplicationsFlaggedIndexBase,
  toListingLeaseUps,
  toApplicationEdit,
  toListing,
  toListings,
  toApplicationNew,
  toLeaseUps,
  toLeaseUpApplications,
  toAttachmentDownload,
  toLotteryResults
}
