import apiService from 'apiService'
import { useLeaseUpListing } from 'query/hooks/useLeaseUpListing'
import { queryKeys } from 'query/queryKeys'

import { renderHookWithQuery, waitFor } from '../../testUtils/queryTestUtils'

jest.mock('apiService')

describe('useLeaseUpListing', () => {
  const mockListingId = 'listing-123'
  const mockListingData = {
    id: mockListingId,
    name: 'Test Listing',
    building_name: 'Test Building',
    status: 'Lease Up'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when listingId is provided', () => {
    beforeEach(() => {
      apiService.getLeaseUpListing.mockResolvedValue(mockListingData)
    })

    test('returns listing data on success', async () => {
      const { result } = renderHookWithQuery(() => useLeaseUpListing(mockListingId))

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockListingData)
      expect(apiService.getLeaseUpListing).toHaveBeenCalledWith(mockListingId)
      expect(apiService.getLeaseUpListing).toHaveBeenCalledTimes(1)
    })

    test('uses correct query key', async () => {
      const { result, queryClient } = renderHookWithQuery(() => useLeaseUpListing(mockListingId))

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const expectedQueryKey = queryKeys.leaseUpListings.detail(mockListingId)
      const cachedData = queryClient.getQueryData(expectedQueryKey)

      expect(cachedData).toEqual(mockListingData)
    })

    test('returns loading state initially', () => {
      const { result } = renderHookWithQuery(() => useLeaseUpListing(mockListingId))

      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBeUndefined()
    })
  })

  describe('when listingId is undefined', () => {
    test('hook is disabled and does not fetch', async () => {
      const { result } = renderHookWithQuery(() => useLeaseUpListing(undefined))

      // Wait a tick to ensure no fetch is triggered
      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(result.current.isLoading).toBe(false)
      expect(result.current.fetchStatus).toBe('idle')
      expect(apiService.getLeaseUpListing).not.toHaveBeenCalled()
    })

    test('hook is disabled when listingId is null', async () => {
      const { result } = renderHookWithQuery(() => useLeaseUpListing(null))

      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(result.current.fetchStatus).toBe('idle')
      expect(apiService.getLeaseUpListing).not.toHaveBeenCalled()
    })

    test('hook is disabled when listingId is empty string', async () => {
      const { result } = renderHookWithQuery(() => useLeaseUpListing(''))

      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(result.current.fetchStatus).toBe('idle')
      expect(apiService.getLeaseUpListing).not.toHaveBeenCalled()
    })
  })

  describe('when API call fails', () => {
    const mockError = new Error('API Error')

    beforeEach(() => {
      apiService.getLeaseUpListing.mockRejectedValue(mockError)
    })

    test('returns error state', async () => {
      const { result } = renderHookWithQuery(() => useLeaseUpListing(mockListingId))

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBe(mockError)
      expect(result.current.data).toBeUndefined()
    })
  })
})
