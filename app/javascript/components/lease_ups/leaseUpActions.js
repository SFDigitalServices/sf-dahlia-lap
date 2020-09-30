import apiService from '~/apiService'
import { map } from 'lodash'
import { buildLeaseUpAppPrefModel } from './leaseUpAppPrefModel'
import { performInSequence } from '~/utils/promiseUtils'

export const getLeaseUpListings = async () => apiService.getLeaseUpListings()

export const getApplications = async (listingId, page, filters) =>
  apiService.fetchLeaseUpApplications(listingId, page, { filters }).then(({ records, pages }) => {
    return {
      records: map(records, buildLeaseUpAppPrefModel),
      pages
    }
  })

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
