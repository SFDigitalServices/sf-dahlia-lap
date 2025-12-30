import apiService from 'apiService'
import { useUnits } from 'query/hooks/useUnits'
import { queryKeys } from 'query/queryKeys'

import { renderHookWithQuery, waitFor } from '../../testUtils/queryTestUtils'

jest.mock('apiService')

describe('useUnits', () => {
  const mockListingId = 'listing-123'
  const mockUnitsData = [
    {
      id: 'unit-1',
      unit_number: '101',
      ami_chart_type: 'HUD',
      ami_chart_year: 2024
    },
    {
      id: 'unit-2',
      unit_number: '102',
      ami_chart_type: 'HUD',
      ami_chart_year: 2024
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when listingId is provided', () => {
    beforeEach(() => {
      apiService.getUnits.mockResolvedValue(mockUnitsData)
    })

    test('returns units data on success', async () => {
      const { result } = renderHookWithQuery(() => useUnits(mockListingId))

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockUnitsData)
      expect(apiService.getUnits).toHaveBeenCalledWith(mockListingId)
      expect(apiService.getUnits).toHaveBeenCalledTimes(1)
    })

    test('uses correct query key', async () => {
      const { result, queryClient } = renderHookWithQuery(() => useUnits(mockListingId))

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const expectedQueryKey = queryKeys.units.byListing(mockListingId)
      const cachedData = queryClient.getQueryData(expectedQueryKey)

      expect(cachedData).toEqual(mockUnitsData)
    })

    test('returns loading state initially', () => {
      const { result } = renderHookWithQuery(() => useUnits(mockListingId))

      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBeUndefined()
    })
  })

  describe('when listingId is undefined', () => {
    test('hook is disabled and does not fetch', async () => {
      const { result } = renderHookWithQuery(() => useUnits(undefined))

      // Wait a tick to ensure no fetch is triggered
      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(result.current.isLoading).toBe(false)
      expect(result.current.fetchStatus).toBe('idle')
      expect(apiService.getUnits).not.toHaveBeenCalled()
    })

    test('hook is disabled when listingId is null', async () => {
      const { result } = renderHookWithQuery(() => useUnits(null))

      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(result.current.fetchStatus).toBe('idle')
      expect(apiService.getUnits).not.toHaveBeenCalled()
    })

    test('hook is disabled when listingId is empty string', async () => {
      const { result } = renderHookWithQuery(() => useUnits(''))

      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(result.current.fetchStatus).toBe('idle')
      expect(apiService.getUnits).not.toHaveBeenCalled()
    })
  })

  describe('when API call fails', () => {
    const mockError = new Error('API Error')

    beforeEach(() => {
      apiService.getUnits.mockRejectedValue(mockError)
    })

    test('returns error state', async () => {
      const { result } = renderHookWithQuery(() => useUnits(mockListingId))

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBe(mockError)
      expect(result.current.data).toBeUndefined()
    })
  })
})
