import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createLease,
  updateLease,
  deleteLease,
  createRentalAssistance,
  updateRentalAssistance,
  deleteRentalAssistance,
  updatePreference
} from 'apiService'
import { queryKeys } from 'query/queryKeys'

const ensureValue = (value, message) => {
  if (value === undefined || value === null) {
    throw new Error(message)
  }
  return value
}

const invalidateLeaseUpRelatedQueries = async ({ queryClient, applicationId, listingId }) => {
  const requests = [
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) => Array.isArray(queryKey) && queryKey[0] === 'applications'
    })
  ]

  if (applicationId) {
    const supplementalParams = listingId ? { listingId } : {}
    requests.push(queryClient.invalidateQueries({ queryKey: queryKeys.application(applicationId) }))
    requests.push(queryClient.invalidateQueries({ queryKey: queryKeys.lease(applicationId) }))
    requests.push(
      queryClient.invalidateQueries({ queryKey: queryKeys.applicationPreferences(applicationId) })
    )
    requests.push(
      queryClient.invalidateQueries({ queryKey: queryKeys.rentalAssistances(applicationId) })
    )
    requests.push(
      queryClient.invalidateQueries({ queryKey: queryKeys.statusHistory(applicationId) })
    )
    requests.push(
      queryClient.invalidateQueries({
        queryKey: queryKeys.supplementalApplication(applicationId, supplementalParams)
      })
    )
  }

  if (listingId) {
    requests.push(queryClient.invalidateQueries({ queryKey: queryKeys.leaseUpListing(listingId) }))
    requests.push(
      queryClient.invalidateQueries({ queryKey: queryKeys.supplementalUnits(listingId) })
    )
  }

  await Promise.all(requests)
}

const useCreateMutation = ({ mutationFn, invalidate, defaultVariables = {}, options = {} }) => {
  const { onSuccess, ...mutationOptions } = options

  return useMutation({
    mutationFn: async (variables = {}) => {
      const mergedVariables = { ...defaultVariables, ...variables }
      return mutationFn(mergedVariables)
    },
    onSuccess: async (data, variables, context) => {
      const mergedVariables = { ...defaultVariables, ...variables }
      await invalidate(mergedVariables)
      if (onSuccess) {
        await onSuccess(data, mergedVariables, context)
      }
    },
    ...mutationOptions
  })
}

const useLeaseUpMutations = (defaults = {}, mutationConfigs = {}) => {
  const { applicationId: defaultApplicationId, listingId: defaultListingId } = defaults
  const queryClient = useQueryClient()

  const invalidateRelatedQueries = async (variables = {}) => {
    const applicationId = variables.applicationId ?? defaultApplicationId
    const listingId = variables.listingId ?? defaultListingId

    await invalidateLeaseUpRelatedQueries({
      queryClient,
      applicationId,
      listingId
    })
  }

  const createLeaseMutation = useCreateMutation({
    defaultVariables: {
      applicationId: defaultApplicationId,
      listingId: defaultListingId
    },
    mutationFn: (variables) => {
      const applicationId = ensureValue(
        variables.applicationId,
        'createLease requires an applicationId'
      )
      return createLease(
        ensureValue(variables.lease, 'createLease requires a lease payload'),
        ensureValue(
          variables.primaryApplicantContactId,
          'createLease requires a primaryApplicantContactId'
        ),
        applicationId
      )
    },
    invalidate: invalidateRelatedQueries,
    options: mutationConfigs.createLease
  })

  const updateLeaseMutation = useCreateMutation({
    defaultVariables: {
      applicationId: defaultApplicationId,
      listingId: defaultListingId
    },
    mutationFn: (variables) => {
      const applicationId = ensureValue(
        variables.applicationId,
        'updateLease requires an applicationId'
      )
      return updateLease(
        ensureValue(variables.lease, 'updateLease requires a lease payload'),
        ensureValue(
          variables.primaryApplicantContactId,
          'updateLease requires a primaryApplicantContactId'
        ),
        applicationId
      )
    },
    invalidate: invalidateRelatedQueries,
    options: mutationConfigs.updateLease
  })

  const deleteLeaseMutation = useCreateMutation({
    defaultVariables: {
      applicationId: defaultApplicationId,
      listingId: defaultListingId
    },
    mutationFn: (variables) => {
      const applicationId = ensureValue(
        variables.applicationId,
        'deleteLease requires an applicationId'
      )
      return deleteLease(
        applicationId,
        ensureValue(variables.leaseId, 'deleteLease requires a leaseId')
      )
    },
    invalidate: invalidateRelatedQueries,
    options: mutationConfigs.deleteLease
  })

  const createRentalAssistanceMutation = useCreateMutation({
    defaultVariables: {
      applicationId: defaultApplicationId,
      listingId: defaultListingId
    },
    mutationFn: (variables) => {
      const applicationId = ensureValue(
        variables.applicationId,
        'createRentalAssistance requires an applicationId'
      )
      return createRentalAssistance(
        ensureValue(
          variables.rentalAssistance,
          'createRentalAssistance requires a rentalAssistance payload'
        ),
        applicationId
      )
    },
    invalidate: invalidateRelatedQueries,
    options: mutationConfigs.createRentalAssistance
  })

  const updateRentalAssistanceMutation = useCreateMutation({
    defaultVariables: {
      applicationId: defaultApplicationId,
      listingId: defaultListingId
    },
    mutationFn: (variables) => {
      const applicationId = ensureValue(
        variables.applicationId,
        'updateRentalAssistance requires an applicationId'
      )
      return updateRentalAssistance(
        ensureValue(
          variables.rentalAssistance,
          'updateRentalAssistance requires a rentalAssistance payload'
        ),
        applicationId
      )
    },
    invalidate: invalidateRelatedQueries,
    options: mutationConfigs.updateRentalAssistance
  })

  const deleteRentalAssistanceMutation = useCreateMutation({
    defaultVariables: {
      applicationId: defaultApplicationId,
      listingId: defaultListingId
    },
    mutationFn: (variables) =>
      deleteRentalAssistance(
        ensureValue(
          variables.rentalAssistanceId,
          'deleteRentalAssistance requires a rentalAssistanceId'
        )
      ),
    invalidate: invalidateRelatedQueries,
    options: mutationConfigs.deleteRentalAssistance
  })

  const updatePreferenceMutation = useCreateMutation({
    defaultVariables: {
      applicationId: defaultApplicationId,
      listingId: defaultListingId
    },
    mutationFn: (variables) =>
      updatePreference(
        ensureValue(variables.preference, 'updatePreference requires a preference payload')
      ),
    invalidate: invalidateRelatedQueries,
    options: mutationConfigs.updatePreference
  })

  return {
    createLeaseMutation,
    updateLeaseMutation,
    deleteLeaseMutation,
    createRentalAssistanceMutation,
    updateRentalAssistanceMutation,
    deleteRentalAssistanceMutation,
    updatePreferenceMutation
  }
}

export { useLeaseUpMutations, invalidateLeaseUpRelatedQueries }
