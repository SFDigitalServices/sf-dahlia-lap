import apiService from '~/apiService'
import { request } from '~/api/request'

const mockLeasePostFn = jest.fn(() => Promise.resolve({ lease: true }))
const mockLeasePutFn = jest.fn(() => Promise.resolve({ lease: true }))
const mockPostFn = jest.fn(() => Promise.resolve(true))
const mockPutFn = jest.fn(() => Promise.resolve(true))
const mockDestroyFn = jest.fn(() => Promise.resolve(true))
request.destroy = mockDestroyFn

const getExpectedLeaseResponse = (lease, contact = undefined, leaseStartDate = {}) => ({
  'lease': {
    ...lease,
    lease_start_date: leaseStartDate,
    primary_applicant_contact: contact
  }
})

describe('apiService', () => {
  const fakeAppId = 'fake_application_id'
  const fakeContact = 'fake_contact'

  describe('createLease', () => {
    beforeAll(() => {
      request.post = mockLeasePostFn
      request.put = mockLeasePutFn
    })

    test('should submit post request to create lease properly', async () => {
      var lease = {
        'monthly_parking_rent': 100
      }
      var expectedData = getExpectedLeaseResponse(lease, fakeContact)

      var result = await apiService.createLease(lease, fakeContact, fakeAppId)

      expect(result).toEqual(true)
      expect(mockLeasePostFn.mock.calls.length).toEqual(1)
      expect(mockLeasePostFn.mock.calls[0]).toEqual([`/applications/${fakeAppId}/leases`, expectedData])
    })
  })

  describe('updateLease', () => {
    beforeAll(() => {
      request.post = mockLeasePostFn
      request.put = mockLeasePutFn
    })
    const fakeLeaseId = 'fake_lease_id'

    test('should submit put request to update lease correctly', async () => {
      var lease = {
        'id': fakeLeaseId,
        'monthly_parking_rent': 100
      }
      var expectedData = getExpectedLeaseResponse(lease, fakeContact)

      var result = await apiService.updateLease(lease, fakeContact, fakeAppId)

      expect(result).toEqual(true)
      expect(mockLeasePutFn.mock.calls.length).toEqual(1)
      expect(mockLeasePutFn.mock.calls[0]).toEqual([`/applications/${fakeAppId}/leases/${fakeLeaseId}`, expectedData])
    })
  })

  describe('createRentalAssistance', () => {
    beforeAll(() => {
      request.post = mockPostFn
    })
    test('should send a post request with expected format', async () => {
      var rentalAssistance = {
        'property': 'something'
      }
      var expectedData = { 'rental_assistance': rentalAssistance, 'application_id': fakeAppId }

      var result = await apiService.createRentalAssistance(rentalAssistance, fakeAppId)

      expect(result).toEqual(true)
      expect(mockPostFn.mock.calls.length).toEqual(1)
      expect(mockPostFn.mock.calls[0]).toEqual([`/rental-assistances`, expectedData])
    })
  })
  describe('updateRentalAssistance', () => {
    beforeAll(() => {
      request.put = mockPutFn
    })
    test('should send a put request with expected format', async () => {
      const fakeRentalAssistanceId = 'fake_rental_id'
      var rentalAssistance = {
        'id': fakeRentalAssistanceId
      }
      var expectedData = { 'rental_assistance': rentalAssistance, 'application_id': fakeAppId }

      var result = await apiService.updateRentalAssistance(rentalAssistance, fakeAppId)
      expect(result).toEqual(true)
      expect(mockPutFn.mock.calls.length).toEqual(1)
      expect(mockPutFn.mock.calls[0]).toEqual([`/rental-assistances/${fakeRentalAssistanceId}`, expectedData])
    })
  })
  describe('deleteRentalAssistance', () => {
    test('should send a delete request with expected format', async () => {
      const fakeRentalAssistanceId = 'fake_rental_id'

      var result = await apiService.deleteRentalAssistance(fakeRentalAssistanceId)
      expect(result).toEqual(true)
      expect(mockDestroyFn.mock.calls.length).toEqual(1)
      expect(mockDestroyFn.mock.calls[0]).toEqual([`/rental-assistances/${fakeRentalAssistanceId}`])
    })
  })
})
