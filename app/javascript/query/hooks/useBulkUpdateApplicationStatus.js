import { useMutation, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'

import { createFieldUpdateComment } from '../../components/supplemental_application/utils/supplementalRequestUtils'
import { invalidateApplicationsForListing, invalidateStatusHistory } from '../invalidation'
import { queryKeys } from '../queryKeys'

const SALESFORCE_DATE_FORMAT = 'YYYY-MM-DD'

/**
 * Mutation hook for bulk updating multiple applications' statuses with optimistic updates.
 * Handles multiple application IDs in a single mutation, with rollback on any failure.
 *
 * @param {string} listingId - The listing ID for cache invalidation
 * @returns {UseMutationResult} TanStack Query mutation result
 */
export function useBulkUpdateApplicationStatus(listingId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ applicationsData }) => {
      // Create status update requests for all applications
      const statusUpdateRequests = Object.keys(applicationsData).map((applicationId) => {
        const { status, comment, subStatus } = applicationsData[applicationId]
        return createFieldUpdateComment(applicationId, status, comment, subStatus)
          .then(() => ({ applicationId, success: true }))
          .catch((error) => ({ applicationId, success: false, error }))
      })

      const results = await Promise.all(statusUpdateRequests)
      const failures = results.filter((r) => !r.success)

      if (failures.length > 0) {
        const error = new Error(
          `Failed to update ${failures.length} out of ${results.length} applications`
        )
        error.failures = failures
        error.successes = results.filter((r) => r.success)
        throw error
      }

      return results
    },

    onMutate: async ({ applicationsData }) => {
      // Cancel in-flight queries for this listing to prevent race conditions
      await queryClient.cancelQueries({
        queryKey: queryKeys.leaseUpApplications.list(listingId)
      })

      // Snapshot current cache data for potential rollback
      const previousData = queryClient.getQueriesData({
        queryKey: queryKeys.leaseUpApplications.list(listingId)
      })

      // Optimistically update all affected applications in matching queries
      queryClient.setQueriesData(
        { queryKey: queryKeys.leaseUpApplications.list(listingId) },
        (old) => {
          if (!old?.records) return old
          return {
            ...old,
            records: old.records.map((app) => {
              const updateData = applicationsData[app.application_id]
              if (updateData) {
                return {
                  ...app,
                  lease_up_status: updateData.status,
                  sub_status: updateData.subStatus,
                  sub_status_label: updateData.subStatus || updateData.comment || null,
                  status_last_updated: moment().format(SALESFORCE_DATE_FORMAT)
                }
              }
              return app
            })
          }
        }
      )

      // Return context with previous data for rollback
      return { previousData, applicationsData }
    },

    onError: (_err, _variables, context) => {
      // Rollback cache to previous state on error
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },

    onSettled: (_data, _error, { applicationsData }) => {
      // Invalidate queries to ensure data consistency after mutation
      invalidateApplicationsForListing(queryClient, listingId)

      // Invalidate status history for all affected applications
      Object.keys(applicationsData).forEach((applicationId) => {
        invalidateStatusHistory(queryClient, applicationId)
      })
    }
  })
}
