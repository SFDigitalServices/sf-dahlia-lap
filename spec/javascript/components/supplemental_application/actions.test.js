import { updateApplicationAction } from 'components/supplemental_application/actions'
import supplementalApplication from '../../fixtures/supplemental_application'
import { mapApplication } from '~/components/mappers/soqlToDomain'
import mockSupplementalSubmitPayload from '../../fixtures/supplemental_submit_payload'

const mockFn = jest.fn()

jest.mock('apiService', () => {
  const mockSubmitApplication = async (data) => {
    mockFn(data)
    return true
  }

  return { submitApplication: mockSubmitApplication }
})

describe('actions', () => {
  test('it should submit to shortForm', async () => {
    const applicationDomain = mapApplication(supplementalApplication)
    const response = await updateApplicationAction(applicationDomain)

    expect(response).toEqual(true)
    expect(mockFn.mock.calls.length).toEqual(1)
    expect(mockFn.mock.calls[0][0]).toEqual(mockSupplementalSubmitPayload)
  })
})
