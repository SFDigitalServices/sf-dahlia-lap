import { useQuery } from '@tanstack/react-query'

import apiService from 'apiService'

import { queryKeys } from '../queryKeys'

/**
 * Hook to fetch and cache short form application details.
 *
 * @param {string} applicationId - The ID of the application to fetch
 * @param {object} options - Additional react-query options
 * @returns {object} Query result with application and fileBaseUrl
 */
export function useShortFormApplication(applicationId, options = {}) {
  const query = useQuery({
    queryKey: queryKeys.shortFormApplications.detail(applicationId),
    queryFn: () => apiService.getShortFormApplication(applicationId),
    enabled: !!applicationId,
    ...options
  })

  return {
    ...query,
    application: query.data?.application,
    fileBaseUrl: query.data?.fileBaseUrl
  }
}
