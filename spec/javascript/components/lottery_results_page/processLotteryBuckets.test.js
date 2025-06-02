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
  })
})
