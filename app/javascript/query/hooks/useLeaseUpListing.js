import { useQuery } from '@tanstack/react-query'

import apiService from 'apiService'

import { queryKeys } from '../queryKeys'

/**
 * Hook to fetch and cache lease up listing details by ID.
 *
 * @param {string} listingId - The ID of the listing to fetch
 * @param {object} options - Additional react-query options
 * @returns {object} Query result with listing data
 */
export function useLeaseUpListing(listingId, options = {}) {
  return useQuery({
    queryKey: queryKeys.leaseUpListings.detail(listingId),
    queryFn: () => apiService.getLeaseUpListing(listingId),
    enabled: !!listingId,
    ...options
  })
}
