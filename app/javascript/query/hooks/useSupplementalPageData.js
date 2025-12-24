import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'
import { uniqBy } from 'lodash'

import { setApplicationDefaults } from 'components/supplemental_application/actions/supplementalActionUtils'
import { getInitialLeaseState } from 'components/supplemental_application/utils/leaseSectionStates'
import { getSupplementalPageData } from 'components/supplemental_application/utils/supplementalRequestUtils'

import { queryKeys } from '../queryKeys'

/**
 * Get unique AMI charts from units
 */
const getListingAmiCharts = (units) =>
  uniqBy(units, (u) => [u.ami_chart_type, u.ami_chart_year].join())

/**
 * Hook to fetch and cache all supplemental page data including:
 * - Application details with lease and rental assistances
 * - Units for the listing
 * - Listing details
 * - Status history
 *
 * @param {string} applicationId - The ID of the application to fetch
 * @param {string} listingId - Optional listing ID for parallel fetching
 * @param {object} options - Additional react-query options
 * @returns {object} Query result with all supplemental page data
 */
export function useSupplementalPageData(applicationId, listingId = null, options = {}) {
  const query = useQuery({
    queryKey: queryKeys.supplementalApplications.detail(applicationId),
    queryFn: () => getSupplementalPageData(applicationId, listingId),
    enabled: !!applicationId,
    ...options
  })

  // Transform the data to match the expected format for the page
  // Memoize to prevent unnecessary re-renders
  const pageData = useMemo(() => {
    if (!query.data) return null
    return {
      application: setApplicationDefaults(query.data.application),
      units: query.data.units,
      fileBaseUrl: query.data.fileBaseUrl,
      leaseSectionState: getInitialLeaseState(query.data.application),
      listing: query.data.listing,
      listingAmiCharts: getListingAmiCharts(query.data.units || []),
      rentalAssistances: query.data.application?.rental_assistances || [],
      statusHistory: query.data.statusHistory
    }
  }, [query.data])

  return {
    ...query,
    pageData,
    application: pageData?.application,
    units: pageData?.units,
    fileBaseUrl: pageData?.fileBaseUrl,
    leaseSectionState: pageData?.leaseSectionState,
    listing: pageData?.listing,
    listingAmiCharts: pageData?.listingAmiCharts,
    rentalAssistances: pageData?.rentalAssistances,
    statusHistory: pageData?.statusHistory
  }
}
