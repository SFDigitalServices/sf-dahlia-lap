import { act } from '@testing-library/react'

import mockFlaggedApplications from '../../../fixtures/flagged_applications'
import { renderAppWithUrl } from '../../../testUtils/wrapperUtil'

jest.mock('apiService', () => {
  return {
    fetchFlaggedApplicationsByRecordSet: async (_recordSetId) => {
      return { flaggedRecords: mockFlaggedApplications }
    }
  }
})

describe('FlaggedApplicationsShowPage', () => {
  test('should render succesfully', async () => {
    expect(
      await act(async () => renderAppWithUrl('applications/flagged/a0r0P000024EwFnQAK'))
    ).toMatchSnapshot()
  })
})
