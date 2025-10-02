import { useQuery } from '@tanstack/react-query'

import apiService from 'apiService'
import { getSupplementalPageData } from 'components/supplemental_application/utils/supplementalRequestUtils'
import { queryKeys } from 'query/queryKeys'

const useSupplementalPageData = ({ applicationId, listingId }, options = {}) => {
  return useQuery({
    queryKey: queryKeys.supplementalApplication(applicationId, { listingId }),
    queryFn: () => getSupplementalPageData(applicationId, listingId),
    enabled: Boolean(applicationId),
    ...options
  })
}

const useSupplementalUnits = (listingId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.supplementalUnits(listingId),
    queryFn: () => apiService.getUnits(listingId),
    enabled: Boolean(listingId),
    ...options
  })
}

export { useSupplementalPageData, useSupplementalUnits }
