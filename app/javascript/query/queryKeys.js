const baseKey = (scope, ...rest) => [
  scope,
  ...rest.filter((value) => value !== undefined && value !== null)
]

const queryKeys = {
  leaseUpListings: () => baseKey('leaseUps', 'listings'),
  leaseUpListing: (listingId) => baseKey('leaseUps', 'listing', listingId),
  lotteryResults: (listingId, params = {}) => baseKey('lotteryResults', listingId, params),
  applications: ({ listingId, page, filters }) =>
    baseKey('applications', listingId, { page, filters }),
  application: (applicationId) => baseKey('application', applicationId),
  lease: (applicationId) => baseKey('applications', applicationId, 'lease'),
  applicationPreferences: (applicationId) => baseKey('applications', applicationId, 'preferences'),
  flaggedApplications: (type) => baseKey('flaggedApplications', type),
  flaggedApplicationsByRecordSet: (recordSetId) =>
    baseKey('flaggedApplications', 'recordSet', recordSetId),
  statusHistory: (applicationId) => baseKey('applications', applicationId, 'statusHistory'),
  rentalAssistances: (applicationId) => baseKey('applications', applicationId, 'rentalAssistances'),
  supplementalApplication: (applicationId, params = {}) =>
    baseKey('supplemental', 'application', applicationId, params),
  supplementalUnits: (listingId, params = {}) =>
    baseKey('supplemental', 'units', listingId, params),
  ami: ({ chartType, chartYear }) => baseKey('ami', chartType, chartYear)
}

export { baseKey, queryKeys }
