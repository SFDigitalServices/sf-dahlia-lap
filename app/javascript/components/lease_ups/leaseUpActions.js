import apiService from '~/apiService'
import { map } from 'lodash'
import { buildLeaseUpAppPrefModel } from './leaseUpAppPrefModel'

export const getLeaseUpListings = async () => apiService.getLeaseUpListings()

export const getApplications = async (listingId, page, filters) =>
  apiService.fetchLeaseUpApplications(listingId, page, { filters }).then(({ records, pages }) => {
    return {
      records: map(records, buildLeaseUpAppPrefModel),
      pages
    }
  })
