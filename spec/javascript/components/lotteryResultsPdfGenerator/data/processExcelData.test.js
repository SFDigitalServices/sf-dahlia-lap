import { buildBuckets } from 'components/LotteryResultsPdfGenerator/data/processExcelData'

import { testApplicants, testPrefIDs, testBucketResults } from '../processExcelDataTestData'

describe('Process Excel Data', () => {
  describe('buildBuckets', () => {
    test('it should return the correct data', () => {
      const buckets = buildBuckets(testApplicants, testPrefIDs)
      console.log(buckets[4].preferenceResults)
      expect(buildBuckets(testApplicants, testPrefIDs)).toEqual(testBucketResults)
    })
  })
})
