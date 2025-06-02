/* eslint-disable jest/no-conditional-expect */
import { request } from 'api/request'
import apiService from 'apiService'

import supplementalApplication from './fixtures/supplemental_application'

const mockFailedRequest = jest.fn(() =>
  Promise.resolve({ lease: true }).then(() => {
    throw new Error('Promise failed')
  })
)

const mockLeaseUpApplicationsGetRequest = jest.fn(() => Promise.resolve({ lease: true }))
const mockLeasePostRequest = jest.fn(() => Promise.resolve({ lease: true }))
const mockLeaseDeleteRequest = jest.fn(() => Promise.resolve(true))
const mockLeasePutRequest = jest.fn(() => Promise.resolve({ lease: true }))
const mockSupAppGetRequest = jest.fn(() =>
  Promise.resolve({
    application: {
      id: 'applicationId',
      child_snake_case_key: 'someValue'
    },
    file_base_url: 'file base url'
  })
)
const mockLeaseGetRequest = jest.fn(() => Promise.resolve({ lease: supplementalApplication.lease }))
const mockStatusHistoryGetRequest = jest.fn(() => Promise.resolve({ data: [] }))
const mockUnitsGetRequest = jest.fn(() => Promise.resolve({ units: [{ id: 'unitId' }] }))
const mockPostRequest = jest.fn(() => Promise.resolve(true))
const mockPutRequest = jest.fn(() => Promise.resolve(true))
const mockDestroyRequest = jest.fn(() => Promise.resolve(true))
const mockFetchFlaggedApplicationsRequest = jest.fn(() => Promise.resolve(true))
const mockFetchApplicationsForLotteryResults = jest.fn(() => Promise.resolve({}))
const mockFetchLotteryResults = jest.fn(() => Promise.resolve({}))
const mockFetchLeaseUpApplications = jest.fn(() =>
  Promise.resolve({ records: [], pages: 0, listing_type: 'Standard Lottery', total_size: 0 })
)

request.destroy = mockDestroyRequest

const getExpectedLeaseResponse = (lease, contact = undefined, leaseStartDate = {}) => ({
  lease: {
    ...lease,
    lease_start_date: leaseStartDate,
    primary_applicant_contact: contact
  }
})

describe('apiService', () => {
  const fakeAppId = 'fake_application_id'
  const fakeContact = 'fake_contact'

  describe('getSupplementalPageData', () => {
    describe('when the request succeeds', () => {
      let result
      let errorCaught
      beforeEach(async () => {
        request.get = mockSupAppGetRequest
        result = await apiService.getSupplementalApplication('applicationId').catch(() => {
          errorCaught = true
        })
      })

      test('does not fail', () => {
        expect(errorCaught).toBeFalsy()
      })

      test('calls with the correct params', () => {
        expect(mockSupAppGetRequest.mock.calls).toHaveLength(1)
        expect(mockSupAppGetRequest.mock.calls[0]).toEqual([
          '/supplementals/applicationId',
          null,
          true
        ])
      })

      test('converts the top-level response params to camelcase', () => {
        expect(result).toEqual({
          application: {
            id: 'applicationId',
            child_snake_case_key: 'someValue'
          },
          fileBaseUrl: 'file base url'
        })
      })
    })

    describe('when the request fails', () => {
      beforeEach(async () => {
        request.get = mockFailedRequest
      })

      test('propagates the error', async () => {
        let errorCaught = false

        await apiService.getSupplementalApplication('applicationId').catch(() => {
          errorCaught = true
        })

        expect(errorCaught).toBeTruthy()
      })
    })
  })

  describe('getUnits', () => {
    let result
    let errorCaught
    beforeEach(async () => {
      request.get = mockUnitsGetRequest
      result = await apiService.getUnits('listingId').catch(() => {
        errorCaught = true
      })
    })

    test('does not fail', () => {
      expect(errorCaught).toBeFalsy()
    })

    test('calls with the correct params', () => {
      expect(mockUnitsGetRequest.mock.calls).toHaveLength(1)
      expect(mockUnitsGetRequest.mock.calls[0]).toEqual([
        '/supplementals/units',
        { params: { listing_id: 'listingId' } },
        true
      ])
    })

    test('converts the top-level response params to camelcase', () => {
      expect(result).toEqual([{ id: 'unitId' }])
    })

    describe('when the request fails', () => {
      beforeEach(async () => {
        request.get = mockFailedRequest
      })

      test('propagates the error', async () => {
        let errorCaught = false

        await apiService.getUnits('applicationId', 'listingId').catch(() => {
          errorCaught = true
        })

        expect(errorCaught).toBeTruthy()
      })
    })
  })

  describe('getLease', () => {
    let result
    let errorCaught
    beforeEach(async () => {
      request.get = mockLeaseGetRequest
      result = await apiService.getLease('applicationId').catch(() => {
        errorCaught = true
      })
    })

    test('does not fail', () => {
      expect(errorCaught).toBeFalsy()
    })

    test('calls with the correct params', () => {
      expect(mockLeaseGetRequest.mock.calls).toHaveLength(1)
      expect(mockLeaseGetRequest.mock.calls[0]).toEqual([
        '/applications/applicationId/leases',
        null,
        true
      ])
    })

    test('returns the lease object directly', () => {
      expect(result).toEqual(supplementalApplication.lease)
    })

    describe('when the request fails', () => {
      beforeEach(async () => {
        request.get = mockFailedRequest
      })

      test('propagates the error', async () => {
        let errorCaught = false

        await apiService.getLease('applicationId').catch(() => {
          errorCaught = true
        })

        expect(errorCaught).toBeTruthy()
      })
    })
  })

  describe('getStatusHistory', () => {
    let result
    let errorCaught
    beforeEach(async () => {
      request.get = mockStatusHistoryGetRequest
      result = await apiService.getStatusHistory('applicationId').catch(() => {
        errorCaught = true
      })
    })

    test('does not fail', () => {
      expect(errorCaught).toBeFalsy()
    })

    test('calls with the correct params', () => {
      expect(mockStatusHistoryGetRequest.mock.calls).toHaveLength(1)
      expect(mockStatusHistoryGetRequest.mock.calls[0]).toEqual([
        '/applications/applicationId/field_update_comments',
        null,
        true
      ])
    })

    test('returns the lease object directly', () => {
      expect(result).toEqual({ statusHistory: [] })
    })

    describe('when the request fails', () => {
      beforeEach(async () => {
        request.get = mockFailedRequest
      })

      test('propagates the error', async () => {
        let errorCaught = false

        await apiService.getStatusHistory('applicationId').catch(() => {
          errorCaught = true
        })

        expect(errorCaught).toBeTruthy()
      })
    })
  })

  describe('createLease', () => {
    beforeAll(() => {
      request.post = mockLeasePostRequest
      request.put = mockLeasePutRequest
    })

    test('should submit post request to create lease properly', async () => {
      const lease = {
        monthly_parking_rent: 100
      }
      const expectedData = getExpectedLeaseResponse(lease, fakeContact)

      const result = await apiService.createLease(lease, fakeContact, fakeAppId)

      expect(result).toBe(true)
      expect(mockLeasePostRequest.mock.calls).toHaveLength(1)
      expect(mockLeasePostRequest.mock.calls[0]).toEqual([
        `/applications/${fakeAppId}/leases`,
        expectedData,
        true
      ])
    })

    test('should fail if the lease already contains a salesforce ID', async () => {
      const lease = {
        id: 'lease_id',
        monthly_parking_rent: 100
      }
      let throwsError = false
      await apiService.createLease(lease, fakeContact, fakeAppId).catch((err) => {
        throwsError = true
        expect(err.message).toBe('Trying to create a lease that already exists.')
      })

      expect(mockLeasePostRequest.mock.calls).toHaveLength(0)
      expect(throwsError).toBeTruthy()
    })
  })

  describe('updateLease', () => {
    beforeAll(() => {
      request.post = mockLeasePostRequest
      request.put = mockLeasePutRequest
    })
    const fakeLeaseId = 'fake_lease_id'

    test('should submit put request to update lease correctly', async () => {
      const lease = {
        id: fakeLeaseId,
        monthly_parking_rent: 100
      }
      const expectedData = getExpectedLeaseResponse(lease, fakeContact)

      const result = await apiService.updateLease(lease, fakeContact, fakeAppId)

      expect(result).toBe(true)
      expect(mockLeasePutRequest.mock.calls).toHaveLength(1)
      expect(mockLeasePutRequest.mock.calls[0]).toEqual([
        `/applications/${fakeAppId}/leases/${fakeLeaseId}`,
        expectedData,
        true
      ])
    })

    test('should fail if the lease doesn’t have an id', async () => {
      const lease = {
        monthly_parking_rent: 100
      }
      let throwsError = false
      await apiService.updateLease(lease, fakeContact, fakeAppId).catch((err) => {
        throwsError = true
        expect(err.message).toBe('Trying to update a lease that doesn’t yet exist.')
      })

      expect(mockLeasePutRequest.mock.calls).toHaveLength(0)
      expect(throwsError).toBeTruthy()
    })
  })

  describe('createRentalAssistance', () => {
    beforeAll(() => {
      request.post = mockPostRequest
    })
    test('should send a post request with expected format', async () => {
      const rentalAssistance = {
        property: 'something'
      }
      const expectedData = { rental_assistance: rentalAssistance, application_id: fakeAppId }

      const result = await apiService.createRentalAssistance(rentalAssistance, fakeAppId)

      expect(result).toBe(true)
      expect(mockPostRequest.mock.calls).toHaveLength(1)
      expect(mockPostRequest.mock.calls[0]).toEqual(['/rental-assistances', expectedData, true])
    })
  })
  describe('updateRentalAssistance', () => {
    beforeAll(() => {
      request.put = mockPutRequest
    })
    test('should send a put request with expected format', async () => {
      const fakeRentalAssistanceId = 'fake_rental_id'
      const rentalAssistance = {
        id: fakeRentalAssistanceId
      }
      const expectedData = { rental_assistance: rentalAssistance, application_id: fakeAppId }

      const result = await apiService.updateRentalAssistance(rentalAssistance, fakeAppId)
      expect(result).toBe(true)
      expect(mockPutRequest.mock.calls).toHaveLength(1)
      expect(mockPutRequest.mock.calls[0]).toEqual([
        `/rental-assistances/${fakeRentalAssistanceId}`,
        expectedData,
        true
      ])
    })
  })
  describe('deleteRentalAssistance', () => {
    test('should send a delete request with expected format', async () => {
      const fakeRentalAssistanceId = 'fake_rental_id'

      const result = await apiService.deleteRentalAssistance(fakeRentalAssistanceId)
      expect(result).toBe(true)
      expect(mockDestroyRequest.mock.calls).toHaveLength(1)
      expect(mockDestroyRequest.mock.calls[0][0]).toBe(
        `/rental-assistances/${fakeRentalAssistanceId}`
      )
    })
  })

  describe('deleteLease', () => {
    const applicationId = 'applicationId'
    const leaseId = 'leaseId'

    beforeEach(async () => {
      request.destroy = mockLeaseDeleteRequest
      await apiService.deleteLease(applicationId, leaseId)
    })

    test('calls request.delete', async () => {
      expect(mockLeaseDeleteRequest.mock.calls).toHaveLength(1)
    })

    test('calls request.delete with the correct params', async () => {
      expect(mockLeaseDeleteRequest.mock.calls[0]).toEqual([
        '/applications/applicationId/leases/leaseId',
        null,
        true
      ])
    })
  })

  describe('fetchFlaggedApplications', () => {
    const flagType = 'pending'
    test('calls request.get', async () => {
      request.get = mockFetchFlaggedApplicationsRequest
      await apiService.fetchFlaggedApplications(flagType)
      expect(mockFetchFlaggedApplicationsRequest.mock.calls[0]).toEqual([
        '/flagged-applications',
        { params: { type: flagType } },
        true
      ])
    })
  })

  describe('fetchFlaggedApplicationsByRecordSet', () => {
    const recordSetId = 'recordSetId'
    test('calls request.get', async () => {
      request.get = mockFetchFlaggedApplicationsRequest
      await apiService.fetchFlaggedApplicationsByRecordSet(recordSetId)
      expect(mockFetchFlaggedApplicationsRequest.mock.calls[0][0]).toBe(
        `/flagged-applications/record-set/${recordSetId}`
      )
    })
  })

  describe('fetchApplicationsForLotteryResults', () => {
    test('calls request.get', async () => {
      request.get = mockFetchApplicationsForLotteryResults
      await apiService.fetchApplicationsForLotteryResults('fake-listing-id')
      expect(mockFetchApplicationsForLotteryResults.mock.calls[0][0]).toBe(
        `/lottery-results?listing_id=fake-listing-id`
      )
    })
  })

  describe('fetchLotteryResults', () => {
    test('calls request.get', async () => {
      request.get = mockFetchLotteryResults
      await apiService.fetchLotteryResults('fake-listing-id')
      expect(mockFetchLotteryResults.mock.calls[0][0]).toBe(
        `/lottery-results?listing_id=fake-listing-id&use_lottery_result_api=true`
      )
    })
  })

  describe('fetchLeaseUpApplicationsPagination', () => {
    beforeAll(() => {
      request.get = mockLeaseUpApplicationsGetRequest
    })

    test('calls request.get', async () => {
      request.get = mockFetchLeaseUpApplications
      await apiService.fetchLeaseUpApplicationsPagination('fake-listing-id', 0, {
        filters: { test: 'test' }
      })
      expect(mockFetchLeaseUpApplications.mock.calls[0][0]).toBe(`/lease-ups/applications`)
    })
  })
})
