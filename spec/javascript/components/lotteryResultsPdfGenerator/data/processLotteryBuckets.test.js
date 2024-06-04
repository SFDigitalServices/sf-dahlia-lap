import { processLotteryBuckets } from 'components/LotteryResultsPdfGenerator/data/processLotteryBuckets'

import {
  testBuckets,
  processedBucketsCombinedFalse,
  processedBucketsCombinedTrue
} from '../testBuckets'

describe('Process Lottery Buckets', () => {
  describe('when combineGroups is true', () => {
    test('it should return the correct data', () => {
      expect(processLotteryBuckets(testBuckets, true)).toEqual(processedBucketsCombinedTrue)
    })
  })
  describe('when combineGroups is false', () => {
    test('it should return the correct data', () => {
      expect(processLotteryBuckets(testBuckets, false)).toEqual(processedBucketsCombinedFalse)
    })
  })
})
