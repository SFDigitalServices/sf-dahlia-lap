const mockSupplementalRequestUtils = {
  getSupplementalPageData: jest.fn().mockResolvedValue({
    application: { id: 'updatedApplicationId' },
    statusHistory: [],
    fileBaseUrl: 'fileBaseUrl',
    units: [],
    listing: { id: 'listingId' }
  }),
  updateApplication: jest.fn().mockResolvedValue({ id: 'applicationId' }),
  createFieldUpdateComment: jest.fn().mockResolvedValue(),
  updateApplicationAndAddComment: jest.fn().mockResolvedValue({
    application: { id: 'updatedApplicationId' },
    statusHistory: []
  }),
  saveLeaseAndAssistances: jest.fn().mockResolvedValue({
    lease: { id: 'leaseId' },
    rentalAssistances: [{ id: 'rentalAssistanceId' }]
  }),
  deleteLease: jest.fn().mockResolvedValue(),
  getAMIAction: jest.fn().mockResolvedValue(),
  updatePreference: jest.fn().mockResolvedValue(),
  updateTotalHouseholdRent: jest.fn().mockResolvedValue()
}

export default mockSupplementalRequestUtils
