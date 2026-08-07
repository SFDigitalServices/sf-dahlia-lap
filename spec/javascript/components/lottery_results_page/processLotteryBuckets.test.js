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
        }
      ])

      expect(buckets.map((bucket) => bucket.shortCode)).toEqual(['DTHP'])
    })

    test('it should keep applicants from an unmapped preference in the unfiltered rank', () => {
      const [unfiltered, ...buckets] = massageLotteryBuckets([
        {
          preferenceShortCode: 'NOT_A_REAL_PREFERENCE',
          preferenceResults: [{ lotteryNumber: 'orphan', lotteryRank: 1 }]
        }
      ])

      expect(buckets).toEqual([])
      expect(unfiltered.preferenceResults).toEqual([
        { lottery_number: 'orphan', unsorted_lottery_rank: 1 }
      ])
    })
  })
})
