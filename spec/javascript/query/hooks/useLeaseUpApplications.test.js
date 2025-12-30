import { getApplicationsPagination } from 'components/lease_ups/utils/leaseUpRequestUtils'
import { useLeaseUpApplications } from 'query/hooks/useLeaseUpApplications'
import { queryKeys } from 'query/queryKeys'

import { createTestQueryClient, renderHookWithQuery, waitFor } from '../../testUtils/queryTestUtils'

// Import the mocked function for use in tests

// Mock the leaseUpRequestUtils module
jest.mock('components/lease_ups/utils/leaseUpRequestUtils', () => ({
  getApplicationsPagination: jest.fn()
}))

describe('useLeaseUpApplications', () => {
  const mockListingId = 'listing-123'
  const mockFilters = { status: 'Processing' }

  // Generate mock records for testing pagination
  const generateMockRecords = (count, startIndex = 0) =>
    Array.from({ length: count }, (_, i) => ({
      application_id: `app-${startIndex + i}`,
      name: `Applicant ${startIndex + i}`,
      lease_up_status: 'Processing'
    }))

  const createMockResponse = (records, pages = 1) => ({
    records,
    pages
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when listingId is provided', () => {
    test('returns applications data on success', async () => {
      const mockRecords = generateMockRecords(20)
      getApplicationsPagination.mockResolvedValue(createMockResponse(mockRecords, 1))

      const { result } = renderHookWithQuery(() =>
        useLeaseUpApplications(mockListingId, 0, mockFilters)
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data.records).toEqual(mockRecords)
      expect(getApplicationsPagination).toHaveBeenCalledWith(mockListingId, 0, mockFilters)
    })

    test('returns displayRecords sliced for current UI page', async () => {
      // Server returns 200 records, UI page shows 20
      const mockRecords = generateMockRecords(200)
      getApplicationsPagination.mockResolvedValue(createMockResponse(mockRecords, 1))

      const { result } = renderHookWithQuery(() =>
        useLeaseUpApplications(mockListingId, 0, mockFilters)
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // UI page 0 should show first 20 records
      expect(result.current.displayRecords).toHaveLength(20)
      expect(result.current.displayRecords[0].application_id).toBe('app-0')
      expect(result.current.displayRecords[19].application_id).toBe('app-19')
    })

    test('slices records correctly for different UI pages within same server page', async () => {
      const mockRecords = generateMockRecords(200)
      getApplicationsPagination.mockResolvedValue(createMockResponse(mockRecords, 1))

      // UI page 2 (records 40-59) should still be on server page 0
      const { result } = renderHookWithQuery(() =>
        useLeaseUpApplications(mockListingId, 2, mockFilters)
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.displayRecords).toHaveLength(20)
      expect(result.current.displayRecords[0].application_id).toBe('app-40')
      expect(result.current.displayRecords[19].application_id).toBe('app-59')
    })
  })

  describe('server page calculation', () => {
    test('calculates server page 0 for UI pages 0-9', async () => {
      const mockRecords = generateMockRecords(200)
      getApplicationsPagination.mockResolvedValue(createMockResponse(mockRecords, 2))

      // UI page 5 should map to server page 0 (5 * 20 = 100, 100 / 200 = 0)
      const { result } = renderHookWithQuery(() =>
        useLeaseUpApplications(mockListingId, 5, mockFilters)
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(getApplicationsPagination).toHaveBeenCalledWith(mockListingId, 0, mockFilters)
    })

    test('calculates server page 1 for UI pages 10-19', async () => {
      const mockRecords = generateMockRecords(200)
      getApplicationsPagination.mockResolvedValue(createMockResponse(mockRecords, 2))

      // UI page 10 should map to server page 1 (10 * 20 = 200, 200 / 200 = 1)
      const { result } = renderHookWithQuery(() =>
        useLeaseUpApplications(mockListingId, 10, mockFilters)
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(getApplicationsPagination).toHaveBeenCalledWith(mockListingId, 1, mockFilters)
    })
  })

  describe('totalPages calculation', () => {
    test('calculates total UI pages from server pages', async () => {
      const mockRecords = generateMockRecords(200)
      // 2 server pages = 400 records = 20 UI pages
      getApplicationsPagination.mockResolvedValue(createMockResponse(mockRecords, 2))

      const { result } = renderHookWithQuery(() =>
        useLeaseUpApplications(mockListingId, 0, mockFilters)
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.totalPages).toBe(20)
    })

    test('returns 0 totalPages when no data', async () => {
      getApplicationsPagination.mockResolvedValue(createMockResponse([], 0))

      const { result } = renderHookWithQuery(() =>
        useLeaseUpApplications(mockListingId, 0, mockFilters)
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.totalPages).toBe(0)
    })
  })

  describe('when listingId is undefined', () => {
    test('hook is disabled and does not fetch', async () => {
      const { result } = renderHookWithQuery(() =>
        useLeaseUpApplications(undefined, 0, mockFilters)
      )

      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(result.current.fetchStatus).toBe('idle')
      expect(getApplicationsPagination).not.toHaveBeenCalled()
    })
  })

  describe('query key structure', () => {
    test('uses correct query key with page and filters', async () => {
      const mockRecords = generateMockRecords(20)
      getApplicationsPagination.mockResolvedValue(createMockResponse(mockRecords, 1))

      const { result, queryClient } = renderHookWithQuery(() =>
        useLeaseUpApplications(mockListingId, 0, mockFilters)
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const expectedQueryKey = queryKeys.leaseUpApplications.page(mockListingId, 0, mockFilters)
      const cachedData = queryClient.getQueryData(expectedQueryKey)

      expect(cachedData).toBeDefined()
      expect(cachedData.records).toEqual(mockRecords)
    })
  })

  describe('keepPreviousData behavior', () => {
    test('maintains previous data during page transitions', async () => {
      const page0Records = generateMockRecords(200, 0)
      const page1Records = generateMockRecords(200, 200)

      getApplicationsPagination
        .mockResolvedValueOnce(createMockResponse(page0Records, 2))
        .mockResolvedValueOnce(createMockResponse(page1Records, 2))

      const queryClient = createTestQueryClient()

      // First render with page 0
      const { result, rerender } = renderHookWithQuery(
        ({ uiPage }) => useLeaseUpApplications(mockListingId, uiPage, mockFilters),
        {
          initialProps: { uiPage: 0 },
          queryClient
        }
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.displayRecords[0].application_id).toBe('app-0')

      // Change to page 10 (server page 1)
      rerender({ uiPage: 10 })

      // Should still have previous data while fetching
      expect(result.current.isPlaceholderData).toBe(true)
      expect(result.current.displayRecords).toBeDefined()

      await waitFor(() => expect(result.current.isPlaceholderData).toBe(false))
      expect(result.current.displayRecords[0].application_id).toBe('app-200')
    })
  })

  describe('empty displayRecords', () => {
    test('returns empty array when no records', async () => {
      getApplicationsPagination.mockResolvedValue(createMockResponse([], 0))

      const { result } = renderHookWithQuery(() =>
        useLeaseUpApplications(mockListingId, 0, mockFilters)
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.displayRecords).toEqual([])
    })
  })
})
