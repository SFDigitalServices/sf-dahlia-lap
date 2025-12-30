import { QueryClient } from '@tanstack/react-query'

import { createFieldUpdateComment } from 'components/supplemental_application/utils/supplementalRequestUtils'
import { useBulkUpdateApplicationStatus } from 'query/hooks/useBulkUpdateApplicationStatus'
import { queryKeys } from 'query/queryKeys'

import { renderHookWithQuery, waitFor } from '../../testUtils/queryTestUtils'

// Mock the supplementalRequestUtils module
jest.mock('components/supplemental_application/utils/supplementalRequestUtils', () => ({
  createFieldUpdateComment: jest.fn()
}))

describe('useBulkUpdateApplicationStatus', () => {
  const mockListingId = 'listing-123'

  // Generate mock application records
  const generateMockRecords = (count) =>
    Array.from({ length: count }, (_, i) => ({
      application_id: `app-${i}`,
      name: `Applicant ${i}`,
      lease_up_status: 'Processing',
      sub_status: null
    }))

  // Create a query client with longer gcTime for cache tests
  const createCacheTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 1000 * 60, // 1 minute
          staleTime: 0
        },
        mutations: {
          retry: false
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('bulk mutation function', () => {
    test('handles multiple applications successfully', async () => {
      createFieldUpdateComment.mockResolvedValue({ success: true })

      const { result } = renderHookWithQuery(() => useBulkUpdateApplicationStatus(mockListingId))

      const applicationsData = {
        'app-0': { status: 'Approved', comment: 'Comment 1', subStatus: 'Approved - Signed Lease' },
        'app-1': { status: 'Disqualified', comment: 'Comment 2', subStatus: null },
        'app-2': { status: 'Withdrawn', comment: null, subStatus: null }
      }

      result.current.mutate({ applicationsData })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // Verify createFieldUpdateComment was called for each application
      expect(createFieldUpdateComment).toHaveBeenCalledTimes(3)
      expect(createFieldUpdateComment).toHaveBeenCalledWith(
        'app-0',
        'Approved',
        'Comment 1',
        'Approved - Signed Lease'
      )
      expect(createFieldUpdateComment).toHaveBeenCalledWith(
        'app-1',
        'Disqualified',
        'Comment 2',
        null
      )
      expect(createFieldUpdateComment).toHaveBeenCalledWith('app-2', 'Withdrawn', null, null)
    })
  })

  describe('optimistic updates for bulk operations', () => {
    test('updates all affected applications in cache immediately', async () => {
      let resolveApiCalls
      const apiPromise = new Promise((resolve) => {
        resolveApiCalls = resolve
      })
      createFieldUpdateComment.mockReturnValue(apiPromise)

      const queryClient = createCacheTestQueryClient()
      const mockRecords = generateMockRecords(5)
      const queryKey = queryKeys.leaseUpApplications.page(mockListingId, 0, {})

      // Pre-populate cache with initial data
      queryClient.setQueryData(queryKey, { records: mockRecords, pages: 1 })

      const { result } = renderHookWithQuery(() => useBulkUpdateApplicationStatus(mockListingId), {
        queryClient
      })

      const applicationsData = {
        'app-0': { status: 'Approved', comment: 'Comment 1', subStatus: 'Approved - Signed Lease' },
        'app-2': { status: 'Disqualified', comment: 'Comment 2', subStatus: null }
      }

      result.current.mutate({ applicationsData })

      // Wait for mutation to be pending
      await waitFor(() => expect(result.current.isPending).toBe(true))

      // Verify cache was updated optimistically for all affected applications
      const queriesData = queryClient.getQueriesData({
        queryKey: queryKeys.leaseUpApplications.list(mockListingId)
      })

      expect(queriesData.length).toBeGreaterThan(0)
      const [, cachedData] = queriesData[0]

      const app0 = cachedData.records.find((app) => app.application_id === 'app-0')
      expect(app0.lease_up_status).toBe('Approved')
      expect(app0.sub_status).toBe('Approved - Signed Lease')

      const app2 = cachedData.records.find((app) => app.application_id === 'app-2')
      expect(app2.lease_up_status).toBe('Disqualified')
      expect(app2.sub_status).toBeNull()

      // Unaffected application should remain unchanged
      const app1 = cachedData.records.find((app) => app.application_id === 'app-1')
      expect(app1.lease_up_status).toBe('Processing')

      // Resolve API calls
      resolveApiCalls({ success: true })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
  })

  describe('rollback on partial failure', () => {
    test('restores all applications to previous state when any update fails', async () => {
      // First call succeeds, second fails
      createFieldUpdateComment
        .mockResolvedValueOnce({ success: true })
        .mockRejectedValueOnce(new Error('API Error'))

      const queryClient = createCacheTestQueryClient()
      const mockRecords = generateMockRecords(5)
      const queryKey = queryKeys.leaseUpApplications.page(mockListingId, 0, {})

      // Pre-populate cache with initial data
      queryClient.setQueryData(queryKey, { records: mockRecords, pages: 1 })

      const { result } = renderHookWithQuery(() => useBulkUpdateApplicationStatus(mockListingId), {
        queryClient
      })

      const applicationsData = {
        'app-0': { status: 'Approved', comment: 'Comment 1', subStatus: 'Approved - Signed Lease' },
        'app-1': { status: 'Disqualified', comment: 'Comment 2', subStatus: null }
      }

      result.current.mutate({ applicationsData })

      // Wait for error state (partial failure throws error)
      await waitFor(() => expect(result.current.isError).toBe(true))

      // Verify cache was rolled back to original state for all applications
      const queriesData = queryClient.getQueriesData({
        queryKey: queryKeys.leaseUpApplications.list(mockListingId)
      })

      expect(queriesData.length).toBeGreaterThan(0)
      const [, cachedData] = queriesData[0]

      // Both applications should be rolled back to original state
      const app0 = cachedData.records.find((app) => app.application_id === 'app-0')
      expect(app0.lease_up_status).toBe('Processing')
      expect(app0.sub_status).toBeNull()

      const app1 = cachedData.records.find((app) => app.application_id === 'app-1')
      expect(app1.lease_up_status).toBe('Processing')
      expect(app1.sub_status).toBeNull()
    })

    test('error contains information about failed applications', async () => {
      createFieldUpdateComment
        .mockResolvedValueOnce({ success: true })
        .mockRejectedValueOnce(new Error('API Error for app-1'))

      const queryClient = createCacheTestQueryClient()
      const mockRecords = generateMockRecords(5)
      const queryKey = queryKeys.leaseUpApplications.page(mockListingId, 0, {})
      queryClient.setQueryData(queryKey, { records: mockRecords, pages: 1 })

      const { result } = renderHookWithQuery(() => useBulkUpdateApplicationStatus(mockListingId), {
        queryClient
      })

      const applicationsData = {
        'app-0': { status: 'Approved', comment: null, subStatus: null },
        'app-1': { status: 'Disqualified', comment: null, subStatus: null }
      }

      result.current.mutate({ applicationsData })

      await waitFor(() => expect(result.current.isError).toBe(true))

      // Error should contain failure information
      expect(result.current.error.message).toContain('Failed to update')
      expect(result.current.error.failures).toBeDefined()
      expect(result.current.error.failures).toHaveLength(1)
      expect(result.current.error.successes).toBeDefined()
      expect(result.current.error.successes).toHaveLength(1)
    })
  })
})
