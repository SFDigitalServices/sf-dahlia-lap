import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createFieldUpdateComment } from '../../components/supplemental_application/utils/supplementalRequestUtils'
import {
  invalidateApplicationsForListing,
  invalidateStatusHistory
} from '../invalidation'
import { queryKeys } from '../queryKeys'

/**
 * Mutation hook for updating a single application's status with optimistic updates.
 *
 * @param {string} listingId - The listing ID for cache invalidation
 * @returns {UseMutationResult} TanStack Query mutation result
 */
export function useUpdateApplicationStatus(listingId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ applicationId, status, comment, substatus }) =>
      createFieldUpdateComment(applicationId, status, comment, substatus),

    onMutate: async ({ applicationId, status, substatus }) => {
      // Cancel in-flight queries for this listing to prevent race conditions
      await queryClient.cancelQueries({
        queryKey: queryKeys.leaseUpApplications.list(listingId)
      })

      // Snapshot current cache data for potential rollback
      const previousData = queryClient.getQueriesData({
        queryKey: queryKeys.leaseUpApplications.list(listingId)
      })

      // Optimistically update all matching queries
      queryClient.setQueriesData(
        { queryKey: queryKeys.leaseUpApplications.list(listingId) },
        (old) => {
          if (!old?.records) return old
          return {
            ...old,
            records: old.records.map((app) =>
              app.application_id === applicationId
                ? { ...app, lease_up_status: status, sub_status: substatus }
                : app
            )
          }
        }
      )

      // Return context with previous data for rollback
      return { previousData }
    },

    onError: (err, variables, context) => {
      // Rollback cache to previous state on error
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },

    onSettled: (data, error, { applicationId }) => {
      // Invalidate queries to ensure data consistency after mutation
      invalidateApplicationsForListing(queryClient, listingId)
      invalidateStatusHistory(queryClient, applicationId)
    }
  })
}
