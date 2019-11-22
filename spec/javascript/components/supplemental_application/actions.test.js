import { updateApplication } from 'components/supplemental_application/actions'
import supplementalApplication from '../../fixtures/supplemental_application'
import { mapApplication } from '~/components/mappers/soqlToDomain'
import mockSupplementalSubmitPayload from '../../fixtures/supplemental_submit_payload'
import { cloneDeep } from 'lodash'

const mockSubmitAppFn = jest.fn()
const mockSubmitLeaseFn = jest.fn()
const mockCreateRentalFn = jest.fn()
const mockUpdateRentalFn = jest.fn()

jest.mock('apiService', () => {
  const mockSubmitApplication = async (data) => {
    mockSubmitAppFn(data)
    return true
  }

  const mockCreateOrUpdateLease = async (data) => {
    mockSubmitLeaseFn(data)
    return true
  }

  const mockCreateRental = async (data) => {
    mockCreateRentalFn(data)
    return true
  }

  const mockUpdateRental = async (data) => {
    mockUpdateRentalFn(data)
    return true
  }

  return {
    submitApplication: mockSubmitApplication,
    createOrUpdateLease: mockCreateOrUpdateLease,
    createRentalAssistance: mockCreateRental,
    updateRentalAssistance: mockUpdateRental
  }
})

describe('updateApplication', () => {
  test('it should submit application to shortForm endpoint', async () => {
    const applicationDomain = mapApplication(supplementalApplication)
    const response = await updateApplication(applicationDomain)

    expect(response).not.toEqual(false)
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
    expect(response).not.toEqual(false)
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
    expect(response).not.toEqual(false)
    expect(mockSubmitAppFn.mock.calls.length).toEqual(1)
    expect(mockSubmitLeaseFn.mock.calls.length).toEqual(0)
  })
  test('it should create and update rental assistances', async () => {
    const baseApplication = {
      'id': 'appID',
      'name': 'APP-12345',
      'listing': {
        'id': 'listingID'
      },
      'rental_assistances': [
        {id: 'abc1', assistance_amount: 11, recipient: 'recipient'},
        {id: 'abc2', assistance_amount: 22, recipient: 'recipient2'}
      ]
    }
    const application = cloneDeep(baseApplication)
    application.rental_assistances[0].assistance_amount = 22
    application.rental_assistances[2] = {assistance_amount: 22, recipient: 'recipient3'}

    const response = await updateApplication(application, baseApplication)
    expect(response).not.toEqual(false)
    expect(mockCreateRentalFn.mock.calls.length).toEqual(1)
    expect(mockUpdateRentalFn.mock.calls.length).toEqual(1)
  })
})
