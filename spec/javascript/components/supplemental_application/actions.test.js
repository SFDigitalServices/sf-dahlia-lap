import { updateApplicationAction } from 'components/supplemental_application/actions'
import apiService from '~/apiService'
import supplementalApplication from '../../fixtures/supplemental_application'
import { mapFormApplication } from '~/components/mappers/soqlToDomain'
import mockShortFormSubmitPayload from '../../fixtures/short_form_submit_payload'

const mockFn = jest.fn()

jest.mock('apiService', () => {
  const mockSubmitApplication = async (data) => {
    mockFn(data)
    return true
  }

  return { submitApplication: mockSubmitApplication };
})

describe('actions', () => {
  test('it should submit to shortForm', async () => {
    const applicationDomain = mapFormApplication(supplementalApplication)
    const response = await updateApplicationAction(applicationDomain)

    expect(response).toEqual(true)
    expect(mockFn.mock.calls.length).toEqual(1)
    expect(mockFn.mock.calls[0][0]).toEqual(mockShortFormSubmitPayload)
  })
})
