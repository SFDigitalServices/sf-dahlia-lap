import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { updateFlaggedApplication } from 'apiService'
import { queryKeys } from 'query/queryKeys'
import {
  fetchAndMapFlaggedApplications,
  fetchAndMapFlaggedApplicationsByRecordSet
} from 'utils/flaggedAppRequestUtils'

const useFlaggedApplications = (type, options = {}) => {
  return useQuery({
    queryKey: queryKeys.flaggedApplications(type),
    queryFn: () => fetchAndMapFlaggedApplications(type),
    enabled: Boolean(type),
    ...options
  })
}

const useFlaggedApplicationsByRecordSet = (recordSetId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.flaggedApplicationsByRecordSet(recordSetId),
    queryFn: () => fetchAndMapFlaggedApplicationsByRecordSet(recordSetId),
    enabled: Boolean(recordSetId),
    ...options
  })
}

const useUpdateFlaggedApplication = ({ type, recordSetId } = {}, options = {}) => {
  const queryClient = useQueryClient()
  const { onSuccess: userOnSuccess, ...mutationOptions } = options

  return useMutation({
    mutationFn: (payload) => updateFlaggedApplication(payload),
    onSuccess: (data, variables, context) => {
      if (type) {
        queryClient.invalidateQueries(queryKeys.flaggedApplications(type))
      }
      if (recordSetId) {
        queryClient.invalidateQueries(queryKeys.flaggedApplicationsByRecordSet(recordSetId))
      }
      if (userOnSuccess) {
        userOnSuccess(data, variables, context)
      }
    },
    ...mutationOptions
  })
}

export { useFlaggedApplications, useFlaggedApplicationsByRecordSet, useUpdateFlaggedApplication }
