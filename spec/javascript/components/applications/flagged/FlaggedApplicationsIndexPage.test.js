import { act } from '@testing-library/react'

import mockFlaggedRecords from '../../../fixtures/flagged_records'
import { renderAppWithUrl } from '../../../testUtils/wrapperUtil'

jest.mock('apiService', () => {
  return {
    fetchFlaggedApplications: async (_type) => {
      return { title: 'Flagged Applications - Pending Review', flaggedRecords: mockFlaggedRecords }
    }
  }
})

describe('FlaggedApplicationsIndexPage', () => {
  test('should render successfully', async () => {
    expect(
      await act(async () => renderAppWithUrl(`applications/flagged?type=pending`))
    ).toMatchSnapshot()
  })
})
