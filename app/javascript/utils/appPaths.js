
const toApplicationSupplementals = (applicationId) => `/applications/${applicationId}/supplementals`

const toApplication = (applicationId) => `/applications/${applicationId}`

const toApplicationsFlagged = (id) => `/applications/flagged/${id}`

const toApplicationsFlaggedIndex = (type) => `/applications/flagged?type=${type}`

export default {
  toApplicationSupplementals,
  toApplication,
  toApplicationsFlagged,
  toApplicationsFlaggedIndex
}
