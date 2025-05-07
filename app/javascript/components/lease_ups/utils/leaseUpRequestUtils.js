import { map } from 'lodash'

import apiService from 'apiService'

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

export const getListing = async (listingId) => apiService.getLeaseUpListing(listingId)
