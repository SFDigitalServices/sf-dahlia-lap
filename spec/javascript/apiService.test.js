import apiService from '~/apiService'
import { request } from '~/api/request'

const mockPostFn = jest.fn()
const mockPutFn = jest.fn()
const mockDestroyFn = jest.fn()
request.put = mockPutFn
request.post = mockPostFn
request.destroy = mockDestroyFn

describe('apiService', () => {
  const fakeAppId = 'fake_application_id'

  describe('createOrUpdateLease', () => {
    const fakeLeaseId = 'fake_lease_id'

    test('should submit put request to update lease if id is provided', () => {
      var lease = {
        'id': fakeLeaseId,
        'monthly_parking_rent': 100
      }
      var expectedData = {'lease': lease}

      var result = apiService.createOrUpdateLease(lease, fakeAppId)
      expect(result).resolves.toEqual(true)
      expect(mockPutFn.mock.calls.length).toEqual(1)
      expect(mockPutFn.mock.calls[0]).toEqual([`/applications/${fakeAppId}/leases/${fakeLeaseId}`, expectedData])
    })

    test('should submit post request to create lease if no id is provided', () => {
      var lease = {
        'monthly_parking_rent': 100
      }
      var expectedData = {'lease': lease}
      var result = apiService.createOrUpdateLease(lease, fakeAppId)
      expect(result).resolves.toEqual(true)
      expect(mockPostFn.mock.calls.length).toEqual(1)
      expect(mockPostFn.mock.calls[0]).toEqual([`/applications/${fakeAppId}/leases`, expectedData])
    })
  })
  describe('createRentalAssistance', () => {
    test('should send a post request with expected format', () => {
      var rentalAssistance = {
        'property': 'something'
      }
      var expectedData = {'rental_assistance': rentalAssistance, 'application_id': fakeAppId}

      var result = apiService.createRentalAssistance(rentalAssistance, fakeAppId)
      expect(result).resolves.toEqual(true)
      expect(mockPostFn.mock.calls.length).toEqual(1)
      expect(mockPostFn.mock.calls[0]).toEqual([`/rental-assistances`, expectedData])
    })
  })
  describe('updateRentalAssistance', () => {
    test('should send a put request with expected format', () => {
      const fakeRentalAssistanceId = 'fake_rental_id'
      var rentalAssistance = {
        'id': fakeRentalAssistanceId
      }
      var expectedData = {'rental_assistance': rentalAssistance, 'application_id': fakeAppId}

      var result = apiService.updateRentalAssistance(rentalAssistance, fakeAppId)
      expect(result).resolves.toEqual(true)
      expect(mockPutFn.mock.calls.length).toEqual(1)
      expect(mockPutFn.mock.calls[0]).toEqual([`/rental-assistances/${fakeRentalAssistanceId}`, expectedData])
    })
  })
  describe('deleteRentalAssistance', () => {
    test('should send a delete request with expected format', () => {
      const fakeRentalAssistanceId = 'fake_rental_id'

      var result = apiService.deleteRentalAssistance(fakeRentalAssistanceId)
      expect(result).resolves.toEqual(true)
      expect(mockDestroyFn.mock.calls.length).toEqual(1)
      expect(mockDestroyFn.mock.calls[0]).toEqual([`/rental-assistances/${fakeRentalAssistanceId}`])
    })
  })
})
