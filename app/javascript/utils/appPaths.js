const toApplicationsFlagged = (id) => `/applications/flagged/${id}`
const toApplicationsFlaggedIndex = (type) => `/applications/flagged?type=${type}`

export default {
  toApplicationsFlagged,
  toApplicationsFlaggedIndex
}
