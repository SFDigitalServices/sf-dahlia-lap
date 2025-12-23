import { useQuery } from '@tanstack/react-query'

import apiService from 'apiService'

import { queryKeys } from '../queryKeys'

/**
 * Hook to fetch and cache supplemental application details.
 *
 * @param {string} applicationId - The ID of the application to fetch
 * @param {object} options - Additional react-query options
 * @returns {object} Query result with application and fileBaseUrl
 */
export function useSupplementalApplication(applicationId, options = {}) {
  const query = useQuery({
    queryKey: queryKeys.supplementalApplications.detail(applicationId),
    queryFn: () => apiService.getSupplementalApplication(applicationId),
    enabled: !!applicationId,
    ...options
  })

  return {
    ...query,
    application: query.data?.application,
    fileBaseUrl: query.data?.fileBaseUrl
  }
}
