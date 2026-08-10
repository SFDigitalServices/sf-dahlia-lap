import {
  processLotteryBuckets,
  massageLotteryBuckets
} from 'components/lease_ups/lottery_results_page/utils/processLotteryBuckets'

import { testBuckets, testBucketResults } from './testBuckets'
import lotteryResultBuckets from '../../fixtures/lottery_result_buckets'

describe('Process Lottery Buckets', () => {
  describe('processLotteryBuckets', () => {
    test('it should return the correct data when combineGroups is true', () => {
      expect(processLotteryBuckets(testBuckets)).toEqual(testBucketResults)
    })

    const preferenceRecord = ({
      type,
      lotteryNumber,
      rank,
      generalLottery = false,
      manual = null
    }) => ({
      application: {
        general_lottery: generalLottery,
        general_lottery_rank: generalLottery ? rank : null,
        lottery_number: lotteryNumber,
        lottery_number_manual: manual,
        unsorted_lottery_rank: rank
      },
      custom_preference_type: type,
      record_type_for_app_preferences: type
    })

    test('it should put general lottery applicants in their own bucket', () => {
      const buckets = processLotteryBuckets([
        preferenceRecord({ type: 'COP', lotteryNumber: 'pref', rank: 1 }),
        preferenceRecord({ type: 'L_W', lotteryNumber: 'general', rank: 2, generalLottery: true })
      ])
      const general = buckets.find((bucket) => bucket.shortCode === 'generalLottery')

      expect(general.preferenceResults).toEqual([
        { lottery_number: 'general', unsorted_lottery_rank: 2 }
      ])
      // the general lottery applicant belongs to no preference column
      expect(buckets.find((bucket) => bucket.shortCode === 'COP').preferenceResults).toEqual([
        { lottery_number: 'pref', unsorted_lottery_rank: 1 }
      ])
    })

    test('it should prefer a manually assigned lottery number', () => {
      const buckets = processLotteryBuckets([
        preferenceRecord({ type: 'COP', lotteryNumber: 'auto', rank: 1, manual: 'manual' })
      ])

      expect(buckets.find((bucket) => bucket.shortCode === 'COP').preferenceResults).toEqual([
        { lottery_number: 'manual', unsorted_lottery_rank: 1 }
      ])
    })

    test('it should keep applicants from an unmapped preference in the unfiltered rank', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

      const [unfiltered, ...buckets] = processLotteryBuckets([
        preferenceRecord({ type: 'NOT_A_REAL_PREFERENCE', lotteryNumber: 'orphan', rank: 1 })
      ])

      // no column of its own, but the applicant is not lost
      expect(buckets.map((bucket) => bucket.shortCode)).toEqual([
        'COP',
        'DTHP',
        'NRHP',
        'L_W',
        'generalLottery'
      ])
      expect(buckets.every((bucket) => !bucket.preferenceResults.length)).toBe(true)
      expect(unfiltered.preferenceResults).toEqual([
        { lottery_number: 'orphan', unsorted_lottery_rank: 1 }
      ])
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('NOT_A_REAL_PREFERENCE'))

      warn.mockRestore()
    })
  })

  describe('massageLotteryBuckets', () => {
    test('it should adjust the format of data returned from the LotteryResult API', () => {
      const massagedBuckets = massageLotteryBuckets(lotteryResultBuckets)
      massagedBuckets.forEach((bucket) => expect(bucket.shortCode).toBeTruthy())
      massagedBuckets.forEach((bucket) =>
        bucket.preferenceResults.forEach((result) => expect(result.lottery_number).toBeTruthy())
      )
      expect(massagedBuckets.find((bucket) => bucket.shortCode === 'Unfiltered')).toBeTruthy()
    })

    test('it should fold veteran buckets into their base preference', () => {
      const [unfiltered, ...buckets] = massageLotteryBuckets([
        {
          preferenceShortCode: 'V-COP',
          preferenceResults: [
            { lotteryNumber: 'shared', lotteryRank: 1 },
            { lotteryNumber: 'veteran-only', lotteryRank: 9 }
          ]
        },
        {
          preferenceShortCode: 'COP',
          preferenceResults: [
            { lotteryNumber: 'shared', lotteryRank: 1 },
            { lotteryNumber: 'non-veteran', lotteryRank: 2 }
          ]
        },
        {
          preferenceShortCode: null,
          preferenceResults: [{ lotteryNumber: 'general', lotteryRank: 3 }]
        }
      ])

      // no V- column of its own
      expect(buckets.map((bucket) => bucket.shortCode)).toEqual(['COP', 'generalLottery'])

      const cop = buckets.find((bucket) => bucket.shortCode === 'COP')

      // veterans first, flagged for the * the results table renders, and a
      // veteran the API didn't repeat in the base bucket is still listed
      expect(cop.preferenceResults).toEqual([
        { lottery_number: 'shared', unsorted_lottery_rank: 1, isVeteran: true },
        { lottery_number: 'veteran-only', unsorted_lottery_rank: 9, isVeteran: true },
        { lottery_number: 'non-veteran', unsorted_lottery_rank: 2 }
      ])

      // unfiltered rank holds every applicant once, in lottery rank order
      expect(unfiltered.preferenceResults.map(({ lottery_number: n }) => n)).toEqual([
        'shared',
        'non-veteran',
        'general',
        'veteran-only'
      ])
    })

    test('it should keep veterans when the API omits the base preference bucket', () => {
      const [unfiltered, ...buckets] = massageLotteryBuckets([
        {
          preferenceShortCode: 'V-COP',
          preferenceResults: [{ lotteryNumber: 'veteran', lotteryRank: 1 }]
        }
      ])

      expect(buckets.map((bucket) => bucket.shortCode)).toEqual(['COP'])
      expect(buckets[0].preferenceResults).toEqual([
        { lottery_number: 'veteran', unsorted_lottery_rank: 1, isVeteran: true }
      ])
      expect(unfiltered.preferenceResults).toEqual([
        { lottery_number: 'veteran', unsorted_lottery_rank: 1, isVeteran: true }
      ])
    })

    test('it should not add a column for a preference the listing does not have', () => {
      const [, ...buckets] = massageLotteryBuckets([
        {
          preferenceShortCode: 'DTHP',
          preferenceResults: [{ lotteryNumber: 'one', lotteryRank: 1 }]
        },
        // an always-visible preference still gets its empty column, even if the
        // API sends the bucket without any results array at all
        { preferenceShortCode: 'COP' }
      ])

      expect(buckets.map((bucket) => bucket.shortCode)).toEqual(['COP', 'DTHP'])
      expect(buckets.find((bucket) => bucket.shortCode === 'COP').preferenceResults).toEqual([])
    })

    test("it should order columns by the listing's preference order", () => {
      const bucket = (preferenceShortCode, preferenceOrder) => ({
        preferenceShortCode,
        preferenceOrder,
        preferenceResults: [{ lotteryNumber: preferenceShortCode, lotteryRank: preferenceOrder }]
      })

      // the order Salesforce reports, which does not match the order the
      // preferences happen to be defined in
      const buckets = massageLotteryBuckets([
        bucket('RTR-H', 1),
        bucket('V-COP', 2),
        bucket('COP', 3),
        bucket('RB_AHP', 4),
        bucket('V-DTHP', 5),
        bucket('DTHP', 6),
        { preferenceShortCode: null, preferenceResults: [{ lotteryNumber: 'g', lotteryRank: 7 }] }
      ])

      // unfiltered first, general lottery last, preference columns in between
      expect(buckets.map((b) => b.shortCode)).toEqual([
        'Unfiltered',
        'RTR-H',
        'COP',
        'RB_AHP',
        'DTHP',
        'generalLottery'
      ])
    })

    test('it should position a folded column by its veteran bucket when that is all there is', () => {
      const buckets = massageLotteryBuckets([
        {
          preferenceShortCode: 'V-DTHP',
          preferenceOrder: 1,
          preferenceResults: [{ lotteryNumber: 'vet', lotteryRank: 1 }]
        },
        {
          preferenceShortCode: 'COP',
          preferenceOrder: 2,
          preferenceResults: [{ lotteryNumber: 'cop', lotteryRank: 2 }]
        }
      ])

      expect(buckets.map((b) => b.shortCode)).toEqual(['Unfiltered', 'DTHP', 'COP'])
    })

    test('it should keep the veteran flag for someone also in an unmapped preference', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
      const [unfiltered] = massageLotteryBuckets([
        {
          preferenceShortCode: 'NOT_A_REAL_PREFERENCE',
          preferenceResults: [{ lotteryNumber: 'vet', lotteryRank: 1 }]
        },
        {
          preferenceShortCode: 'V-COP',
          preferenceResults: [{ lotteryNumber: 'vet', lotteryRank: 1 }]
        },
        {
          preferenceShortCode: 'COP',
          preferenceResults: [{ lotteryNumber: 'vet', lotteryRank: 1 }]
        }
      ])

      // the unmapped copy of an applicant carries no veteran flag, so it must
      // not be the copy that survives deduping
      expect(unfiltered.preferenceResults).toEqual([
        { lottery_number: 'vet', unsorted_lottery_rank: 1, isVeteran: true }
      ])

      warn.mockRestore()
    })

    test('it should give Right to Return its own column', () => {
      const [, ...buckets] = massageLotteryBuckets([
        {
          preferenceShortCode: 'RTR-H',
          preferenceResults: [{ lotteryNumber: 'one', lotteryRank: 1 }]
        }
      ])

      expect(buckets.map((bucket) => bucket.shortCode)).toEqual(['RTR-H'])
    })

    test('it should keep applicants from an unmapped preference in the unfiltered rank', () => {
      const warnings = []
      const [unfiltered, ...buckets] = massageLotteryBuckets(
        [
          {
            preferenceShortCode: 'NOT_A_REAL_PREFERENCE',
            preferenceResults: [
              { lotteryNumber: 'orphan', lotteryRank: 1 },
              { lotteryNumber: 'orphan-two', lotteryRank: 2 }
            ]
          }
        ],
        warnings
      )

      expect(buckets).toEqual([])
      expect(unfiltered.preferenceResults).toHaveLength(2)
      expect(warnings).toEqual([
        "“NOT_A_REAL_PREFERENCE” isn't a preference this page can display, so it has no column " +
          'of its own and its 2 applications appear only in the Unfiltered Rank column.'
      ])
    })
  })

  describe('warnings', () => {
    // every warning also goes to the console, which would otherwise be noise
    let consoleWarn

    beforeEach(() => {
      consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => consoleWarn.mockRestore())

    const veteranBuckets = (baseResults) => [
      {
        preferenceShortCode: 'V-DTHP',
        preferenceResults: [{ lotteryNumber: 'vet', lotteryRank: 1 }]
      },
      { preferenceShortCode: 'DTHP', preferenceResults: baseResults }
    ]

    test('it should warn when a veteran has no matching base preference', () => {
      const warnings = []

      massageLotteryBuckets(
        veteranBuckets([{ lotteryNumber: 'someone-else', lotteryRank: 2 }]),
        warnings
      )

      expect(warnings).toEqual([
        '1 application has the veteran version of Displaced Tenant Housing Preference (DTHP) but ' +
          "not the preference itself, which shouldn't happen. It's included in the DTHP column, " +
          'but the application data may need to be checked.'
      ])
    })

    test('it should not warn when the veteran data lines up', () => {
      const warnings = []

      massageLotteryBuckets(veteranBuckets([{ lotteryNumber: 'vet', lotteryRank: 1 }]), warnings)

      expect(warnings).toEqual([])
    })

    test('it should warn about an unmapped preference nobody was eligible for', () => {
      const warnings = []

      massageLotteryBuckets([{ preferenceShortCode: 'NOT_A_REAL_PREFERENCE' }], warnings)

      // the listing offered it, so its absence from the results is worth
      // saying even though no applicant is affected
      expect(warnings).toEqual([
        "“NOT_A_REAL_PREFERENCE” isn't a preference this page can display, so it has no column, " +
          "and no applications received it, so it doesn't appear in these results at all."
      ])
    })

    test('it should collect warnings from the preference-record path too', () => {
      const warnings = []

      processLotteryBuckets(
        [
          {
            application: {
              general_lottery: false,
              lottery_number: 'orphan',
              lottery_number_manual: null,
              unsorted_lottery_rank: 1
            },
            custom_preference_type: 'NOT_A_REAL_PREFERENCE'
          }
        ],
        warnings
      )

      expect(warnings).toEqual([
        "“NOT_A_REAL_PREFERENCE” isn't a preference this page can display, so it has no column " +
          'of its own and its 1 application appears only in the Unfiltered Rank column.'
      ])
    })
  })
})
