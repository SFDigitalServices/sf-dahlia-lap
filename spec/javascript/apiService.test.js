import apiService from '~/apiService'
import { request } from '~/api/request'

const mockLeasePostFn = jest.fn(() => Promise.resolve({lease: true}))
const mockLeasePutFn = jest.fn(() => Promise.resolve({lease: true}))
const mockPostFn = jest.fn(() => Promise.resolve(true))
const mockPutFn = jest.fn(() => Promise.resolve(true))
const mockDestroyFn = jest.fn(() => Promise.resolve(true))
request.destroy = mockDestroyFn

describe('apiService', () => {
  const fakeAppId = 'fake_application_id'

  describe('createOrUpdateLease', () => {
    beforeAll(() => {
      request.post = mockLeasePostFn
      request.put = mockLeasePutFn
    })
    const fakeLeaseId = 'fake_lease_id'

    test('should submit put request to update lease if id is provided', async () => {
      var lease = {
        'id': fakeLeaseId,
        'monthly_parking_rent': 100
      }
      var expectedData = {'lease': lease}

      var result = await apiService.createOrUpdateLease(lease, fakeAppId)
      // apiService.createOrUpdateLease has an async call
      // that we then destructure and return instead of
      // returning the result of the async call directly
      // which returns undefined here instead of true
      expect(result).toEqual(true)
      expect(mockLeasePutFn.mock.calls.length).toEqual(1)
      expect(mockLeasePutFn.mock.calls[0]).toEqual([`/applications/${fakeAppId}/leases/${fakeLeaseId}`, expectedData])
    })

    test('should submit post request to create lease if no id is provided', async () => {
      var lease = {
        'monthly_parking_rent': 100
      }
      var expectedData = {'lease': lease}

      var result = await apiService.createOrUpdateLease(lease, fakeAppId)
      // apiService.createOrUpdateLease has an async call
      // that we then destructure and return instead of
      // returning the result of the async call directly
      // which returns undefined here instead of true
      expect(result).toEqual(true)
      expect(mockLeasePostFn.mock.calls.length).toEqual(1)
      expect(mockLeasePostFn.mock.calls[0]).toEqual([`/applications/${fakeAppId}/leases`, expectedData])
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
      var expectedData = {'rental_assistance': rentalAssistance, 'application_id': fakeAppId}

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
      var expectedData = {'rental_assistance': rentalAssistance, 'application_id': fakeAppId}

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
