import { useMemo } from 'react'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getApplicationsPagination } from 'components/lease_ups/utils/leaseUpRequestUtils'
import { GRAPHQL_SERVER_PAGE_SIZE } from 'utils/EagerPagination'

import { queryKeys } from '../queryKeys'

// Number of rows displayed per UI page
const ROWS_PER_PAGE = 20

/**
 * Hook to fetch and cache lease up applications with pagination support.
 * Handles the mapping between UI pages (20 records) and server pages (200 records).
 *
 * @param {string} listingId - The ID of the listing to fetch applications for
 * @param {number} uiPage - The current UI page number (0-indexed)
 * @param {object} filters - Filter parameters to apply to the query
 * @param {object} options - Additional react-query options
 * @returns {object} Query result with displayRecords and totalPages
 */
export function useLeaseUpApplications(listingId, uiPage, filters, options = {}) {
  // Calculate which server page contains the records for the current UI page
  const serverPage = Math.floor((uiPage * ROWS_PER_PAGE) / GRAPHQL_SERVER_PAGE_SIZE)

  const query = useQuery({
    queryKey: queryKeys.leaseUpApplications.page(listingId, serverPage, filters),
    queryFn: () => getApplicationsPagination(listingId, serverPage, filters),
    enabled: !!listingId,
    placeholderData: keepPreviousData,
    ...options
  })

  // Slice the cached server page to get records for the current UI page
  const displayRecords = useMemo(() => {
    if (!query.data?.records) return []
    const startIdx = (uiPage * ROWS_PER_PAGE) % GRAPHQL_SERVER_PAGE_SIZE
    return query.data.records.slice(startIdx, startIdx + ROWS_PER_PAGE)
  }, [query.data, uiPage])

  // Calculate total UI pages from server pages
  const totalPages = useMemo(() => {
    if (!query.data?.pages) return 0
    const totalRecords = query.data.pages * GRAPHQL_SERVER_PAGE_SIZE
    return Math.ceil(totalRecords / ROWS_PER_PAGE)
  }, [query.data])

  return {
    ...query,
    displayRecords,
    totalPages
  }
}
