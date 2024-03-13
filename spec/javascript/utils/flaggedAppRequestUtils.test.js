import {
  fetchAndMapFlaggedApplications,
  fetchAndMapFlaggedApplicationsByRecordSet
} from 'utils/flaggedAppRequestUtils'

import mockedFlaggedRecordSet from '../fixtures/flagged_record_set'
import mockFlaggedRecords from '../fixtures/flagged_records'

const mockFetchFlaggedApplications = jest.fn()
const mockFetchFlaggedApplicationsByRecordSet = jest.fn()

jest.mock('apiService', () => {
  return {
    fetchFlaggedApplications: async (_type) => {
      mockFetchFlaggedApplications(_type)
      return { title: 'Flagged Applications - Pending Review', flagged_records: mockFlaggedRecords }
    },
    fetchFlaggedApplicationsByRecordSet: async (_recordSetId) => {
      mockFetchFlaggedApplicationsByRecordSet(_recordSetId)
      return { flagged_records: mockedFlaggedRecordSet }
    }
  }
})

describe('fetchFlaggedApplications', () => {
  it('fetches and maps flagged application record sets', () => {
    const flagType = 'pending'
    const mappedData = fetchAndMapFlaggedApplications(flagType)
    expect(mockFetchFlaggedApplications).toHaveBeenCalledWith(flagType)
    expect(mappedData).toBeTruthy()
  })
})

describe('fetchFlaggedApplicationsByRecordSet', () => {
  it('fetches and maps a single flagged application record set', () => {
    const recordSetId = 123
    const mappedData = fetchAndMapFlaggedApplicationsByRecordSet(recordSetId)
    expect(mockFetchFlaggedApplicationsByRecordSet).toHaveBeenCalledWith(recordSetId)
    expect(mappedData).toBeTruthy()
  })
})
