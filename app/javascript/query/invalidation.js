import { queryKeys } from './queryKeys'

/**
 * Invalidates all cached applications for a specific listing.
 * Use after status updates or any changes that affect the applications list.
 *
 * @param {QueryClient} queryClient - The TanStack Query client instance
 * @param {string} listingId - The listing ID to invalidate applications for
 */
export const invalidateApplicationsForListing = (queryClient, listingId) => {
  if (!listingId) return

  queryClient.invalidateQueries({
    queryKey: queryKeys.leaseUpApplications.list(listingId)
  })
}

/**
 * Invalidates cached supplemental application data.
 * Use after lease changes, rental assistance changes, or application updates.
 *
 * @param {QueryClient} queryClient - The TanStack Query client instance
 * @param {string} applicationId - The application ID to invalidate
 */
export const invalidateSupplementalApplication = (queryClient, applicationId) => {
  if (!applicationId) return

  queryClient.invalidateQueries({
    queryKey: queryKeys.supplementalApplications.detail(applicationId)
  })
}

/**
 * Invalidates cached status history for an application.
 * Use after status updates.
 *
 * @param {QueryClient} queryClient - The TanStack Query client instance
 * @param {string} applicationId - The application ID to invalidate status history for
 */
export const invalidateStatusHistory = (queryClient, applicationId) => {
  if (!applicationId) return

  queryClient.invalidateQueries({
    queryKey: queryKeys.statusHistory.byApplication(applicationId)
  })
}

/**
 * Convenience function to invalidate all application-related data.
 * Use when multiple caches need to be invalidated together.
 *
 * @param {QueryClient} queryClient - The TanStack Query client instance
 * @param {Object} params - Parameters for invalidation
 * @param {string} [params.listingId] - The listing ID to invalidate applications for
 * @param {string} [params.applicationId] - The application ID to invalidate
 */
export const invalidateApplicationData = (queryClient, { listingId, applicationId }) => {
  if (listingId) {
    invalidateApplicationsForListing(queryClient, listingId)
  }
  if (applicationId) {
    invalidateSupplementalApplication(queryClient, applicationId)
    invalidateStatusHistory(queryClient, applicationId)
  }
}
