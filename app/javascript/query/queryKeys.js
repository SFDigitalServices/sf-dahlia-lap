export const queryKeys = {
  // Lease Up Applications
  leaseUpApplications: {
    all: ['leaseUpApplications'],
    list: (listingId) => ['leaseUpApplications', 'list', listingId],
    page: (listingId, page, filters) => [
      'leaseUpApplications',
      'list',
      listingId,
      { page, filters }
    ]
  },

  // Lease Up Listings
  leaseUpListings: {
    all: ['leaseUpListings'],
    list: () => ['leaseUpListings', 'list'],
    detail: (listingId) => ['leaseUpListings', 'detail', listingId]
  },

  // Supplemental Applications
  supplementalApplications: {
    all: ['supplementalApplications'],
    detail: (applicationId) => ['supplementalApplications', 'detail', applicationId]
  },

  // Status History
  statusHistory: {
    all: ['statusHistory'],
    byApplication: (applicationId) => ['statusHistory', applicationId]
  }
}
