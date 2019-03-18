import apiService from '~/apiService'
// import requestThing from '~/api/requestThing'

const mockApiCallFn = jest.fn()

jest.mock('api/request', () => {
  const mockApiCall = async (method, path, data) => {
    mockApiCallFn(method, path, data)
    return true
  }

  return { apiCall: mockApiCall }
})

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
      expect(mockApiCallFn.mock.calls.length).toEqual(1)
      expect(mockApiCallFn.mock.calls[0]).toEqual(['put', `/applications/${fakeAppId}/leases/${fakeLeaseId}`, expectedData])
    })
    test('should submit post request to create lease if no id is provided', () => {
      var lease = {
        'monthly_parking_rent': 100
      }
      var expectedData = {'lease': lease}
      var result = apiService.createOrUpdateLease(lease, fakeAppId)
      expect(result).resolves.toEqual(true)
      expect(mockApiCallFn.mock.calls.length).toEqual(1)
      expect(mockApiCallFn.mock.calls[0]).toEqual(['post', `/applications/${fakeAppId}/leases`, expectedData])
    })
  })
})
