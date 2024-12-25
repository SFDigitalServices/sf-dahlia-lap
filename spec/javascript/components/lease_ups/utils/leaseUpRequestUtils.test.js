import apiService from 'apiService'
import {
  convertToCommaSeparatedList,
  getApplications,
  getApplicationsPagination,
  sanitizeAndFormatSearch
} from 'components/lease_ups/utils/leaseUpRequestUtils'

jest.mock('apiService')

const fakeListingId = 'listing_id'

describe('leaseUpActions', () => {
  describe('convertToCommaSeparatedList', () => {
    test('it returns a single word if provided', () => {
      expect(convertToCommaSeparatedList('test')).toBe('test')
    })
    test('it turns phrases separated with spaces into a comma separated string list', () => {
      expect(convertToCommaSeparatedList('test1 test2 test3')).toBe('test1,test2,test3')
    })
    test('it strips out excess spaces as expected', () => {
      expect(convertToCommaSeparatedList('test ')).toBe('test')
      expect(convertToCommaSeparatedList(' test ')).toBe('test')
      expect(convertToCommaSeparatedList('test  ')).toBe('test')
      expect(convertToCommaSeparatedList('test  test2')).toBe('test,test2')
    })
    test("it returns as expected when there's a nullish input", () => {
      expect(convertToCommaSeparatedList('')).toBeFalsy()
      expect(convertToCommaSeparatedList(null)).toBeFalsy()
    })
  })
  describe('sanitizeAndFormatSearch', () => {
    test('it removes double quotes from search strings', () => {
      expect(sanitizeAndFormatSearch('"John"')).toBe('John')
      expect(sanitizeAndFormatSearch('"John Doe"')).toBe('John,Doe')
    })
    test('it removes single quotes from search strings', () => {
      expect(sanitizeAndFormatSearch("'John'")).toBe('John')
      expect(sanitizeAndFormatSearch("'John Doe'")).toBe('John,Doe')
    })
  })
  describe('getApplications', () => {
    apiService.fetchLeaseUpApplications.mockResolvedValue({
      pages: 10,
      records: [
        {
          application: {
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
          },
          preference_order: 3,
          receives_preference: true,
          preference_all_lottery_rank: 1,
          post_lottery_validation: 'Confirmed',
          preference_lottery_rank: 1,
          preference_name: 'Live or Work in San Francisco Preference',
          record_type_for_app_preferences: 'L_W',
          custom_preference_type: 'L_W'
        }
      ]
    })

    test('it makes the expected apiService request when no filters are provided', () => {
      getApplications(fakeListingId, 0)
      expect(apiService.fetchLeaseUpApplications).toHaveBeenCalledWith(
        fakeListingId,
        0,
        {
          filters: undefined
        },
        true,
        false
      )
    })
    test('it formats returned data as expected', async () => {
      const expectedRowData = {
        application_id: 'a0o0P00000JlWi9QAF',
        application_number: 'APP-00548121',
        application_preference_id: undefined,
        email: 'christopher60@example.org',
        first_name: 'Vincent',
        has_ada_priorities_selected: null,
        last_name: 'Rogers',
        lease_up_status: 'Disqualified',
        mailing_address: '',
        phone: '(845)136-8280',
        post_lottery_validation: 'Confirmed',
        preference_lottery_rank: 1,
        preference_name: 'Live or Work in San Francisco Preference',
        preference_order: 3,
        preference_record_type: 'L_W',
        residence_address: '',
        status_last_updated: '2020-05-28T21:23:06.000+0000',
        total_household_size: 1,
        sub_status: 'Approval letter sent',
        custom_preference_type: 'L_W',
        layered_validation: 'Confirmed'
      }

      const expectedResults = { records: [expectedRowData], pages: 10 }
      expect(await getApplications(fakeListingId, 0, {}, true)).toEqual(expectedResults)
    })

    test('it passes filters to the apiService as expected', () => {
      const fakeFilters = { filter1: 'something', filter2: 'something else' }
      getApplications(fakeListingId, 0, fakeFilters)
      expect(apiService.fetchLeaseUpApplications).toHaveBeenCalledWith(
        fakeListingId,
        0,
        {
          filters: fakeFilters
        },
        true,
        false
      )
    })
    test('it reformats search strings as expected', () => {
      const fakeFilters = { filter1: 'something', search: 'word1 word2' }
      const expectedFilters = {
        filter1: 'something',
        search: convertToCommaSeparatedList('word1 word2')
      }
      getApplications(fakeListingId, 0, fakeFilters)
      expect(apiService.fetchLeaseUpApplications).toHaveBeenCalledWith(
        fakeListingId,
        0,
        {
          filters: expectedFilters
        },
        true,
        false
      )
    })
  })

  describe('getApplicationsPagination', () => {
    apiService.fetchLeaseUpApplicationsPagination.mockResolvedValue({
      pages: 10,
      records: [
        {
          application: {
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
          },
          preference_order: 3,
          receives_preference: true,
          preference_all_lottery_rank: 1,
          post_lottery_validation: 'Confirmed',
          preference_lottery_rank: 1,
          preference_name: 'Live or Work in San Francisco Preference',
          record_type_for_app_preferences: 'L_W',
          custom_preference_type: 'L_W'
        }
      ]
    })

    test('it makes the expected apiService request when no filters are provided', () => {
      getApplicationsPagination(fakeListingId, 0)
      expect(apiService.fetchLeaseUpApplicationsPagination).toHaveBeenCalledWith(fakeListingId, 0, {
        filters: undefined
      })
    })
    test('it formats returned data as expected', async () => {
      const expectedRowData = {
        application_id: 'a0o0P00000JlWi9QAF',
        application_number: 'APP-00548121',
        application_preference_id: undefined,
        email: 'christopher60@example.org',
        first_name: 'Vincent',
        has_ada_priorities_selected: null,
        last_name: 'Rogers',
        lease_up_status: 'Disqualified',
        mailing_address: '',
        phone: '(845)136-8280',
        post_lottery_validation: 'Confirmed',
        preference_lottery_rank: 1,
        preference_name: 'Live or Work in San Francisco Preference',
        preference_order: 3,
        preference_record_type: 'L_W',
        residence_address: '',
        status_last_updated: '2020-05-28T21:23:06.000+0000',
        total_household_size: 1,
        sub_status: 'Approval letter sent',
        custom_preference_type: 'L_W',
        lottery_status: undefined
      }

      const expectedResults = { records: [expectedRowData], pages: 10 }
      expect(await getApplicationsPagination(fakeListingId, 0, {}, true)).toEqual(expectedResults)
    })

    test('it passes filters to the apiService as expected', () => {
      const fakeFilters = { filter1: 'something', filter2: 'something else' }
      getApplicationsPagination(fakeListingId, 0, fakeFilters)
      expect(apiService.fetchLeaseUpApplicationsPagination).toHaveBeenCalledWith(fakeListingId, 0, {
        filters: fakeFilters
      })
    })
    test('it reformats search strings as expected', () => {
      const fakeFilters = { filter1: 'something', search: 'word1 word2' }
      const expectedFilters = {
        filter1: 'something',
        search: convertToCommaSeparatedList('word1 word2')
      }
      getApplicationsPagination(fakeListingId, 0, fakeFilters)
      expect(apiService.fetchLeaseUpApplicationsPagination).toHaveBeenCalledWith(fakeListingId, 0, {
        filters: expectedFilters
      })
    })
  })

  describe('get First Come, First Served applications', () => {
    test('it formats returned data as expected', async () => {
      apiService.fetchLeaseUpApplications.mockResolvedValue({
        pages: 10,
        records: [
          {
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
            index: 0,
            processing_status: 'Disqualified',
            demographics: {},
            status_last_updated: '2020-05-28T21:23:06.000+0000',
            total_household_size: 1,
            sub_status: 'Approval letter sent'
          }
        ],
        listing_type: 'First Come, First Served'
      })

      const expectedRowData = {
        application_id: 'a0o0P00000JlWi9QAF',
        application_number: 'APP-00548121',
        email: 'christopher60@example.org',
        first_name: 'Vincent',
        has_ada_priorities_selected: null,
        index: 0,
        last_name: 'Rogers',
        lease_up_status: 'Disqualified',
        mailing_address: '',
        phone: '(845)136-8280',
        preference_lottery_rank: null,
        preference_name: 'General',
        preference_order: 1,
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
