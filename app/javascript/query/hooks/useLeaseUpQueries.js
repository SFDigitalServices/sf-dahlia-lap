import { useQuery } from '@tanstack/react-query'

import {
  fetchApplications,
  fetchLeaseUpApplicationsPagination,
  fetchApplicationsForLotteryResults,
  fetchLotteryResults,
  getLeaseUpListing,
  getLeaseUpListings
} from 'apiService'
import { queryKeys } from 'query/queryKeys'

const useLeaseUpListings = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.leaseUpListings(),
    queryFn: () => getLeaseUpListings(),
    ...options
  })
}

const useLeaseUpListing = (listingId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.leaseUpListing(listingId),
    queryFn: () => getLeaseUpListing(listingId),
    enabled: Boolean(listingId),
    ...options
  })
}

const useLeaseUpApplications = ({ listingId, page, filters }, options = {}) => {
  return useQuery({
    queryKey: queryKeys.applications({ listingId, page, filters }),
    queryFn: () => fetchLeaseUpApplicationsPagination(listingId, page, { filters }),
    keepPreviousData: true,
    enabled: Boolean(listingId),
    ...options
  })
}

const useApplications = ({ page, filters }, options = {}) => {
  return useQuery({
    queryKey: queryKeys.applications({ listingId: 'all', page, filters }),
    queryFn: () => fetchApplications({ page, filters }),
    keepPreviousData: true,
    ...options
  })
}

const useLotteryApplications = ({ listingId, useLotteryApi }, options = {}) => {
  return useQuery({
    queryKey: queryKeys.lotteryResults(listingId, { useLotteryApi }),
    queryFn: () =>
      useLotteryApi
        ? fetchLotteryResults(listingId).then((response) => response.lotteryBuckets)
        : fetchApplicationsForLotteryResults(listingId).then((response) => response.records),
    enabled: Boolean(listingId),
    ...options
  })
}

export {
  useLeaseUpListings,
  useLeaseUpListing,
  useLeaseUpApplications,
  useApplications,
  useLotteryApplications
}
