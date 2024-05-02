import { getApplications } from 'components/lease_ups/utils/leaseUpRequestUtils'

const mockFetchLeaseUpApplications = jest.fn()

jest.mock('apiService', () => {
  return {
    fetchLeaseUpApplications: async (listingId, page, { filters }) => {
      mockFetchLeaseUpApplications(listingId, page, { filters })
      const sampleRowResponse = {
        name: 'APP-00548121',
        id: 'a0o0P00000JlWi9QAF',
        general_lottery: false,
        general_lottery_rank: null,
        applicant: {
          first_name: 'Vincent',
          last_name: 'Rogers',
          email: 'christopher60@example.org',
          phone: '(845)136-8280',
          residence_address: '',
          mailing_address: '',
          name: 'Vincent Rogers'
        },
        has_ada_priorities_selected: null,
        processing_status: 'Disqualified',
        demographics: {},
        status_last_updated: '2020-05-28T21:23:06.000+0000',
        total_household_size: 1,
        sub_status: 'Approval letter sent'
      }
      return {
        pages: 10,
        records: [sampleRowResponse],
        listing_type: 'First Come, First Served'
      }
    }
  }
})

const fakeListingId = 'listing_id'

describe('leaseUpActions', () => {
  describe('getApplications', () => {
    test('it formats returned data as expected', async () => {
      const expectedRowData = {
        application_id: 'a0o0P00000JlWi9QAF',
        application_number: 'APP-00548121',
        email: 'christopher60@example.org',
        first_name: 'Vincent',
        has_ada_priorities_selected: null,
        last_name: 'Rogers',
        lease_up_status: 'Disqualified',
        mailing_address: '',
        phone: '(845)136-8280',
        residence_address: '',
        status_last_updated: '2020-05-28T21:23:06.000+0000',
        total_household_size: 1,
        sub_status: 'Approval letter sent'
      }

      const expectedResults = { records: [expectedRowData], pages: 10 }
      expect(await getApplications(fakeListingId, 0)).toEqual(expectedResults)
    })
  })
})
