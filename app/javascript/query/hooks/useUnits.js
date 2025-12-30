import { useQuery } from '@tanstack/react-query'

import apiService from 'apiService'

import { queryKeys } from '../queryKeys'

/**
 * Hook to fetch and cache units data by listing ID.
 * Units are the same for all applications in a listing, so we cache by listingId
 * to avoid redundant API calls when viewing multiple applications in the same listing.
 *
 * @param {string} listingId - The ID of the listing to fetch units for
 * @param {object} options - Additional react-query options
 * @returns {object} Query result with units data
 */
export function useUnits(listingId, options = {}) {
  return useQuery({
    queryKey: queryKeys.units.byListing(listingId),
    queryFn: () => apiService.getUnits(listingId),
    enabled: !!listingId,
    ...options
  })
}
