import { createFieldUpdateComment } from 'components/supplemental_application/utils/supplementalRequestUtils'
import { useUpdateApplicationStatus } from 'query/hooks/useUpdateApplicationStatus'
import { queryKeys } from 'query/queryKeys'

import { createTestQueryClient, renderHookWithQuery, waitFor } from '../../testUtils/queryTestUtils'

// Mock the supplementalRequestUtils module
jest.mock('components/supplemental_application/utils/supplementalRequestUtils', () => ({
  createFieldUpdateComment: jest.fn()
}))

describe('useUpdateApplicationStatus', () => {
  const mockListingId = 'listing-123'
  const mockApplicationId = 'app-456'
  const mockStatus = 'Approved'
  const mockComment = 'Test comment'
  const mockSubstatus = 'Approved - Signed Lease'

  // Generate mock application records
  const generateMockRecords = (count) =>
    Array.from({ length: count }, (_, i) => ({
      application_id: i === 0 ? mockApplicationId : `app-${i}`,
      name: `Applicant ${i}`,
      lease_up_status: 'Processing',
      sub_status: null
    }))

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('mutation function', () => {
    test('calls createFieldUpdateComment with correct params', async () => {
      createFieldUpdateComment.mockResolvedValue({ success: true })

      const { result } = renderHookWithQuery(() => useUpdateApplicationStatus(mockListingId))

      result.current.mutate({
        applicationId: mockApplicationId,
        status: mockStatus,
        comment: mockComment,
        substatus: mockSubstatus
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(createFieldUpdateComment).toHaveBeenCalledWith(
        mockApplicationId,
        mockStatus,
        mockComment,
        mockSubstatus
      )
    })

    test('calls createFieldUpdateComment with null values when not provided', async () => {
      createFieldUpdateComment.mockResolvedValue({ success: true })

      const { result } = renderHookWithQuery(() => useUpdateApplicationStatus(mockListingId))

      result.current.mutate({
        applicationId: mockApplicationId,
        status: mockStatus,
        comment: null,
        substatus: null
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(createFieldUpdateComment).toHaveBeenCalledWith(
        mockApplicationId,
        mockStatus,
        null,
        null
      )
    })
  })

  describe('optimistic updates', () => {
    test('updates cache immediately before API call completes', async () => {
      // Create a promise that we can control
      let resolveApiCall
      const apiPromise = new Promise((resolve) => {
        resolveApiCall = resolve
      })
      createFieldUpdateComment.mockReturnValue(apiPromise)

      // Create a query client with longer gcTime to prevent immediate garbage collection
      const queryClient = new (require('@tanstack/react-query').QueryClient)({
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

      const mockRecords = generateMockRecords(5)
      const queryKey = queryKeys.leaseUpApplications.page(mockListingId, 0, {})

      // Pre-populate cache with initial data
      queryClient.setQueryData(queryKey, { records: mockRecords, pages: 1 })

      const { result } = renderHookWithQuery(() => useUpdateApplicationStatus(mockListingId), {
        queryClient
      })

      // Trigger mutation
      result.current.mutate({
        applicationId: mockApplicationId,
        status: mockStatus,
        comment: mockComment,
        substatus: mockSubstatus
      })

      // Wait for optimistic update to be applied (mutation should be pending)
      await waitFor(() => expect(result.current.isPending).toBe(true))

      // Verify cache was updated optimistically using getQueriesData (matches prefix)
      const queriesData = queryClient.getQueriesData({
        queryKey: queryKeys.leaseUpApplications.list(mockListingId)
      })

      // Should have at least one matching query
      expect(queriesData.length).toBeGreaterThan(0)
      const [, cachedData] = queriesData[0]
      expect(cachedData).toBeDefined()
      const updatedApp = cachedData.records.find((app) => app.application_id === mockApplicationId)
      expect(updatedApp.lease_up_status).toBe(mockStatus)
      expect(updatedApp.sub_status).toBe(mockSubstatus)

      // Now resolve the API call
      resolveApiCall({ success: true })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
  })

  describe('rollback on error', () => {
    test('restores cache to previous state when API call fails', async () => {
      const apiError = new Error('API Error')
      createFieldUpdateComment.mockRejectedValue(apiError)

      // Create a query client with longer gcTime to prevent immediate garbage collection
      const queryClient = new (require('@tanstack/react-query').QueryClient)({
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

      const mockRecords = generateMockRecords(5)
      const queryKey = queryKeys.leaseUpApplications.page(mockListingId, 0, {})

      // Pre-populate cache with initial data
      queryClient.setQueryData(queryKey, { records: mockRecords, pages: 1 })

      // Store original data for comparison
      const originalApp = mockRecords.find((app) => app.application_id === mockApplicationId)

      const { result } = renderHookWithQuery(() => useUpdateApplicationStatus(mockListingId), {
        queryClient
      })

      // Trigger mutation
      result.current.mutate({
        applicationId: mockApplicationId,
        status: mockStatus,
        comment: mockComment,
        substatus: mockSubstatus
      })

      // Wait for error state
      await waitFor(() => expect(result.current.isError).toBe(true))

      // Verify cache was rolled back to original state using getQueriesData
      const queriesData = queryClient.getQueriesData({
        queryKey: queryKeys.leaseUpApplications.list(mockListingId)
      })

      expect(queriesData.length).toBeGreaterThan(0)
      const [, cachedData] = queriesData[0]
      expect(cachedData).toBeDefined()
      const app = cachedData.records.find((app) => app.application_id === mockApplicationId)
      expect(app.lease_up_status).toBe(originalApp.lease_up_status)
      expect(app.sub_status).toBe(originalApp.sub_status)
    })
  })

  describe('cache invalidation', () => {
    test('invalidates queries after successful mutation', async () => {
      createFieldUpdateComment.mockResolvedValue({ success: true })

      const queryClient = createTestQueryClient()
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries')

      const mockRecords = generateMockRecords(5)
      const queryKey = queryKeys.leaseUpApplications.page(mockListingId, 0, {})
      queryClient.setQueryData(queryKey, { records: mockRecords, pages: 1 })

      const { result } = renderHookWithQuery(() => useUpdateApplicationStatus(mockListingId), {
        queryClient
      })

      result.current.mutate({
        applicationId: mockApplicationId,
        status: mockStatus,
        comment: mockComment,
        substatus: mockSubstatus
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // Verify invalidation was called for applications list
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: queryKeys.leaseUpApplications.list(mockListingId)
      })

      // Verify invalidation was called for status history
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: queryKeys.statusHistory.byApplication(mockApplicationId)
      })

      invalidateQueriesSpy.mockRestore()
    })

    test('invalidates queries even after failed mutation', async () => {
      createFieldUpdateComment.mockRejectedValue(new Error('API Error'))

      const queryClient = createTestQueryClient()
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries')

      const mockRecords = generateMockRecords(5)
      const queryKey = queryKeys.leaseUpApplications.page(mockListingId, 0, {})
      queryClient.setQueryData(queryKey, { records: mockRecords, pages: 1 })

      const { result } = renderHookWithQuery(() => useUpdateApplicationStatus(mockListingId), {
        queryClient
      })

      result.current.mutate({
        applicationId: mockApplicationId,
        status: mockStatus,
        comment: mockComment,
        substatus: mockSubstatus
      })

      await waitFor(() => expect(result.current.isError).toBe(true))

      // onSettled should still be called even on error
      expect(invalidateQueriesSpy).toHaveBeenCalled()

      invalidateQueriesSpy.mockRestore()
    })
  })
})
