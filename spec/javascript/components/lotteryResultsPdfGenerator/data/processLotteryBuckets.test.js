import {
  processLotteryBuckets,
  filterBuckets
} from 'components/LotteryResultsPdfGenerator/data/processLotteryBuckets'

import {
  testBuckets,
  processedBucketsCombinedFalse,
  processedBucketsCombinedTrue,
  testBucketsAfter
} from '../testBuckets'

describe('Process Lottery Buckets', () => {
  describe('processLotteryBuckets', () => {
    test('it should return the correct data when combineGroups is true', () => {
      expect(processLotteryBuckets(testBuckets, true)).toEqual(processedBucketsCombinedTrue)
    })
    test('it should return the correct data when combineGroups is false', () => {
      expect(processLotteryBuckets(testBuckets, false)).toEqual(processedBucketsCombinedFalse)
    })
  })
  describe('filterBuckets', () => {
    test('it should return the correct data', () => {
      expect(filterBuckets(testBuckets)).toEqual(testBucketsAfter)
    })
  })
})
