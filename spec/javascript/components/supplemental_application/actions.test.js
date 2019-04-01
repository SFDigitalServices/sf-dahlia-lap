import { updateApplication } from 'components/supplemental_application/actions'
import supplementalApplication from '../../fixtures/supplemental_application'
import { mapApplication } from '~/components/mappers/soqlToDomain'
import mockSupplementalSubmitPayload from '../../fixtures/supplemental_submit_payload'

const mockSubmitAppFn = jest.fn()
const mockSubmitLeaseFn = jest.fn()

jest.mock('apiService', () => {
  const mockSubmitApplication = async (data) => {
    mockSubmitAppFn(data)
    return true
  }

  const mockCreateOrUpdateLease = async (data) => {
    mockSubmitLeaseFn(data)
    return true
  }

  return {
    submitApplication: mockSubmitApplication,
    createOrUpdateLease: mockCreateOrUpdateLease
  }
})

describe('updateApplication', () => {
  test('it should submit application to shortForm endpoint', async () => {
    const applicationDomain = mapApplication(supplementalApplication)
    const response = await updateApplication(applicationDomain)

    expect(response).toEqual(true)
    expect(mockSubmitAppFn.mock.calls.length).toEqual(1)
    expect(mockSubmitAppFn.mock.calls[0][0]).toEqual(mockSupplementalSubmitPayload)
  })
  test('it should submit lease to backend if lease is present in application', async () => {
    const application = {
      'id': 'appID',
      'name': 'APP-12345',
      'listing': {
        'id': 'listingID'
      },
      'lease': {
        'id': 'leaseID'
      }
    }

    const response = await updateApplication(application)
    expect(response).toEqual(true)
    expect(mockSubmitAppFn.mock.calls.length).toEqual(1)
    expect(mockSubmitLeaseFn.mock.calls.length).toEqual(1)
  })
  test('it should not submit lease to backend if application has no lease', async () => {
    const application = {
      'id': 'appID',
      'name': 'APP-12345',
      'listing': {
        'id': 'listingID'
      },
      'lease': {}
    }
    const response = await updateApplication(application)
    expect(response).toEqual(true)
    expect(mockSubmitAppFn.mock.calls.length).toEqual(1)
    expect(mockSubmitLeaseFn.mock.calls.length).toEqual(0)
  })
})
