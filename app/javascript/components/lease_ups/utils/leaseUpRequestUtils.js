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

export const getApplicationsPagination = async (
  listingId,
  page,
  filters,
  withLayeredValidation = false,
  includeGeneralApps = true
) => {
  console.log('in getApplicationsPagination')
  if (filters?.search) {
    filters = { ...filters, search: sanitizeAndFormatSearch(filters?.search) }
  }
  return apiService
    .fetchLeaseUpApplicationsPagination(
      listingId,
      page,
      { filters },
      includeGeneralApps,
      withLayeredValidation
    )
    .then(({ records, pages, listing_type }) => {
      let apps
      if (listing_type === LISTING_TYPE_FIRST_COME_FIRST_SERVED) {
        // remove records that don't have an applicant (this is a bug with form assembly, but we are hiding them for now)
        const cleanRecords = records.filter((record) => record.applicant != null)
        apps = map(cleanRecords, buildLeaseUpAppFirstComeFirstServedModel)
        // add an index, which will be used as the applicant's "rank"
        apps.map((app, index) => {
          app.index = index
          return app
        })
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
        // remove records that don't have an applicant (this is a bug with form assembly, but we are hiding them for now)
        const cleanRecords = records.filter((record) => record.applicant != null)
        apps = map(cleanRecords, buildLeaseUpAppFirstComeFirstServedModel)
        // add an index, which will be used as the applicant's "rank"
        apps.map((app, index) => {
          app.index = index
          return app
        })
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
