import apiService from '~/apiService'
import { request } from '~/api/request'

const mockPostFn = jest.fn()
const mockPutFn = jest.fn()
request.put = mockPutFn
request.post = mockPostFn

describe('apiService', () => {
  describe('createOrUpdateLease', () => {
    const fakeAppId = 'fake_application_id'
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
})
