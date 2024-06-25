import { processLotteryBuckets } from 'components/lease_ups/lottery_results_page/utils/processLotteryBuckets'

import { testBuckets, testBucketResults } from './testBuckets'

describe('Process Lottery Buckets', () => {
  describe('processLotteryBuckets', () => {
    test('it should return the correct data when combineGroups is true', () => {
      expect(processLotteryBuckets(testBuckets)).toEqual(testBucketResults)
    })
  })
})
