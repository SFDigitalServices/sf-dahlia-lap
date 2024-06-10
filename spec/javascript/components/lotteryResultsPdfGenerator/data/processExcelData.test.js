import { buildBuckets } from 'components/LotteryResultsPdfGenerator/data/processExcelData'

import { testApplicants, testPrefIDs, testBucketResults } from '../processExcelDataTestData'

describe('Process Excel Data', () => {
  describe('buildBuckets', () => {
    test('it should return the correct data', () => {
      expect(buildBuckets(testApplicants, testPrefIDs)).toEqual(testBucketResults)
    })
  })
})
