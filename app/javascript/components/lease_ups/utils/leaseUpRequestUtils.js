import { map } from 'lodash'

import apiService from 'apiService'
import { SERVER_PAGE_SIZE } from 'utils/EagerPagination'
import { addLayeredValidation } from 'utils/layeredPreferenceUtil'
import { performInSequence } from 'utils/promiseUtils'

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

export const getApplications = async (listingId, filters) => {
  if (filters?.search) {
    filters = { ...filters, search: sanitizeAndFormatSearch(filters?.search) }
  }
  return apiService.fetchLeaseUpApplications(listingId, { filters }).then(({ records }) => {
    const preferences = map(records, buildLeaseUpAppPrefModel)
    const layeredPreferences = addLayeredValidation(preferences)
    return {
      records: layeredPreferences,
      pages: preferences.length / SERVER_PAGE_SIZE
    }
  })
}

export const getListing = async (listingId) => apiService.getLeaseUpListing(listingId)

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
