const toApplicationSupplementals = (applicationId) => `/applications/${applicationId}/supplementals`

const toApplication = (applicationId) => `/applications/${applicationId}`

// To short form applicatiom with lease up headers and tabs
const toLeaseUpShortForm = (applicationId) => `/applications/${applicationId}?lease_up=true`

const toApplicationEdit = (applicationId) => `/applications/${applicationId}/edit`

const toApplicationNew = (listingId) => `/listings/${listingId}/applications/new`

const toApplicationsFlagged = (id) => `/applications/flagged/${id}`

const toApplicationsFlaggedIndex = (type) => `/applications/flagged?type=${type}`

const toListingLeaseUps = (listingId) => `/listings/lease-ups/${listingId}/applications`

const toListing = (listingId) => `/listings/${listingId}`

const toLeaseUps = () => '/listings/lease-ups'

const toLeaseUpApplications = (listingId) => `/listings/lease-ups/${listingId}/applications`

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
  toApplicationSupplementals,
  toApplication,
  toLeaseUpShortForm,
  toApplicationsFlagged,
  toApplicationsFlaggedIndex,
  toListingLeaseUps,
  toApplicationEdit,
  toListing,
  toApplicationNew,
  toLeaseUps,
  toLeaseUpApplications,
  toAttachmentDownload
}
