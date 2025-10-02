import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateApplicationAndAddComment } from 'components/supplemental_application/utils/supplementalRequestUtils'

import { useLeaseUpMutations, invalidateLeaseUpRelatedQueries } from './useLeaseUpMutations'

const useSupplementalMutations = (defaults = {}, mutationConfigs = {}) => {
  const queryClient = useQueryClient()
  const leaseUpMutations = useLeaseUpMutations(defaults, mutationConfigs)

  const updateStatusMutation = useMutation({
    mutationFn: async (variables = {}) => {
      const {
        application,
        prevApplication,
        status,
        comment,
        substatus,
        shouldSaveLease,
        applicationId,
        listingId
      } = variables

      const result = await updateApplicationAndAddComment(
        application,
        prevApplication,
        status,
        comment,
        substatus,
        shouldSaveLease
      )

      const inferredApplicationId =
        applicationId ?? application?.id ?? defaults.applicationId ?? null
      const inferredListingId = listingId ?? application?.listing?.id ?? defaults.listingId ?? null

      await invalidateLeaseUpRelatedQueries({
        queryClient,
        applicationId: inferredApplicationId,
        listingId: inferredListingId
      })

      return result
    },
    ...(mutationConfigs.updateStatus || {})
  })

  return {
    ...leaseUpMutations,
    updateStatusMutation
  }
}

export { useSupplementalMutations }
