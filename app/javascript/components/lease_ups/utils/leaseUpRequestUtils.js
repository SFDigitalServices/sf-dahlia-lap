import { map } from 'lodash'

import apiService from 'apiService'
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

export const getApplications = async (listingId, page, filters) => {
  if (filters?.search) {
    filters = { ...filters, search: sanitizeAndFormatSearch(filters?.search) }
  }
  return apiService
    .fetchLeaseUpApplications(listingId, page, { filters })
    .then(({ records, pages }) => {
      const preferences = map(records, buildLeaseUpAppPrefModel)
      addLayeredValidation(preferences)
      return {
        records: preferences,
        pages
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
