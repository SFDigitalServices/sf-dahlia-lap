import { useCallback } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import {
  invalidateApplicationsForListing,
  invalidateSupplementalApplication
} from '../invalidation'

/**
 * Hook that provides cache invalidation functions for supplemental application operations.
 * Use this hook in components that perform lease, rental assistance, preference, or application updates.
 *
 * @param {string} applicationId - The application ID for supplemental cache invalidation
 * @param {string} listingId - The listing ID for applications list cache invalidation
 * @returns {object} Object containing invalidation functions
 */
export function useSupplementalCacheInvalidation(applicationId, listingId) {
  const queryClient = useQueryClient()

  /**
   * Invalidate cache after lease create/update/delete operations.
   * Invalidates the supplemental application cache.
   * Requirements: 6.2
   */
  const invalidateOnLeaseChange = useCallback(() => {
    invalidateSupplementalApplication(queryClient, applicationId)
  }, [queryClient, applicationId])

  /**
   * Invalidate cache after rental assistance create/update/delete operations.
   * Invalidates the supplemental application cache.
   * Requirements: 6.3
   */
  const invalidateOnRentalAssistanceChange = useCallback(() => {
    invalidateSupplementalApplication(queryClient, applicationId)
  }, [queryClient, applicationId])

  /**
   * Invalidate cache after preference updates.
   * Invalidates both the applications list and supplemental application caches.
   * Requirements: 6.4
   */
  const invalidateOnPreferenceUpdate = useCallback(() => {
    invalidateSupplementalApplication(queryClient, applicationId)
    invalidateApplicationsForListing(queryClient, listingId)
  }, [queryClient, applicationId, listingId])

  /**
   * Invalidate cache after application updates.
   * Invalidates both the applications list and supplemental application caches.
   * Requirements: 6.1
   */
  const invalidateOnApplicationUpdate = useCallback(() => {
    invalidateSupplementalApplication(queryClient, applicationId)
    invalidateApplicationsForListing(queryClient, listingId)
  }, [queryClient, applicationId, listingId])

  return {
    invalidateOnLeaseChange,
    invalidateOnRentalAssistanceChange,
    invalidateOnPreferenceUpdate,
    invalidateOnApplicationUpdate
  }
}
