import { map } from 'lodash'

import apiService from 'apiService'
import { addLayeredValidation } from 'utils/layeredPreferenceUtil'
import { performInSequence } from 'utils/promiseUtils'

import { LISTING_TYPE_FIRST_COME_FIRST_SERVED } from '../../../utils/consts'
import { buildLeaseUpAppFirstComeFirstServedModel } from '../leaseUpAppFirstComeFirstServedModel'
import { buildLeaseUpAppPrefModel } from '../leaseUpAppPrefModel'

export const getLeaseUpListings = async () => apiService.getLeaseUpListings()

export const convertToCommaSeparatedList = (str) =>
  // Take a series of phrases from the search box and turn it into a comma separated list.
  str
    ?.split(/ +/)
    .filter((x) => x !== '')
    .join(',')

export const sanitizeAndFormatSearch = (str) => {
  return convertToCommaSeparatedList(str.replace(/["']/g, ''))
}

/**
 * @deprecated
 * @todo remove in DAH-2969
 */
export const buildLeaseUpApplicationsParams = (listingId, filters, lastPref, general) => {
  const params = {
    listing_id: listingId,
    ...filters
  }

  if (general) {
    params.general = true
    params.general_lottery_rank = lastPref?.general_lottery_rank ?? null
  } else {
    params.preference_order = lastPref?.preference_order ?? null
    params.preference_lottery_rank = lastPref?.preference_lottery_rank ?? null
  }

  return params
}

const processFcfsApplicationRecords = (records) => {
  const apps = map(records, buildLeaseUpAppFirstComeFirstServedModel)
  // add an index, which will be used as the applicant's "rank"
  return apps.map((app, index) => {
    app.index = index
    return app
  })
}

export const getApplicationsPagination = async (listingId, page, filters) => {
  if (filters?.search) {
    filters = { ...filters, search: sanitizeAndFormatSearch(filters?.search) }
  }
  return apiService
    .fetchLeaseUpApplicationsPagination(listingId, page, { filters })
    .then(({ records, pages, listing_type }) => {
      return {
        records:
          listing_type === LISTING_TYPE_FIRST_COME_FIRST_SERVED
            ? processFcfsApplicationRecords(records)
            : map(records, buildLeaseUpAppPrefModel),
        pages
      }
    })
}

/**
 * @deprecated in favor of getApplicationsPagination
 * @todo remove in DAH-2969
 */
export const getApplications = async (
  listingId,
  page,
  filters,
  withLayeredValidation = false,
  includeGeneralApps = true
) => {
  if (filters?.search) {
    filters = { ...filters, search: sanitizeAndFormatSearch(filters?.search) }
  }
  return apiService
    .fetchLeaseUpApplications(
      listingId,
      page,
      { filters },
      includeGeneralApps,
      withLayeredValidation
    )
    .then(({ records, pages, listing_type }) => {
      let apps
      if (listing_type === LISTING_TYPE_FIRST_COME_FIRST_SERVED) {
        apps = processFcfsApplicationRecords(records)
      } else {
        const preferences = map(records, buildLeaseUpAppPrefModel)
        // only do the layered validation loop if necessary
        apps = withLayeredValidation ? addLayeredValidation(preferences) : preferences
      }
      return {
        records: apps,
        pages
      }
    })
}

export const getListing = async (listingId) => apiService.getLeaseUpListing(listingId)

/**
 * @deprecated No longer used anywhere.
 * @todo remove in DAH-2969
 */
export const getListingAndApplications = async (listingId, page, filters) => {
  const getListing = () => apiService.getLeaseUpListing(listingId)
  const getApplications = () => getApplications(listingId, page, filters)

  const packageResponse = ([listing, applicationResponse]) => ({
    listing,
    records: applicationResponse.records,
    pages: applicationResponse.pages
  })

  return performInSequence(getListing, getApplications).then(packageResponse)
}
