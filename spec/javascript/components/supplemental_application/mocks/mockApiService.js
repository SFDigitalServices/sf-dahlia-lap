const mockApiService = {
  createRentalAssistance: jest.fn().mockResolvedValue({ id: 'newRentalAssistanceId' }),
  updateRentalAssistance: jest.fn().mockResolvedValue(),
  deleteRentalAssistance: jest.fn().mockResolvedValue()
}

export default mockApiService
