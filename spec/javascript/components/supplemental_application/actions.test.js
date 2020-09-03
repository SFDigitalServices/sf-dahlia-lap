import { updateApplication } from 'components/supplemental_application/actions'
import supplementalApplication from '../../fixtures/supplemental_application'
import { cloneDeep } from 'lodash'

const mockSubmitAppFn = jest.fn()
const mockCreateLeaseFn = jest.fn()
const mockUpdateLeaseFn = jest.fn()
const mockCreateRentalFn = jest.fn()
const mockUpdateRentalFn = jest.fn()
const mockGetRentalAssistancesFn = jest.fn()

jest.mock('apiService', () => {
  const mockSubmitApplication = async (application) => {
    mockSubmitAppFn(application)
    return application
  }

  const mockCreateLease = async (lease) => {
    mockCreateLeaseFn(lease)
    return lease
  }

  const mockUpdateLease = async (lease) => {
    mockUpdateLeaseFn(lease)
    return lease
  }

  const mockCreateRental = async (data) => {
    mockCreateRentalFn(data)
    return true
  }

  const mockUpdateRental = async (data) => {
    mockUpdateRentalFn(data)
    return true
  }

  const mockGetRentalAssistances = async (applicationId) => {
    mockGetRentalAssistancesFn(applicationId)
    return []
  }

  return {
    submitApplication: mockSubmitApplication,
    createLease: mockCreateLease,
    updateLease: mockUpdateLease,
    createRentalAssistance: mockCreateRental,
    updateRentalAssistance: mockUpdateRental,
    getRentalAssistances: mockGetRentalAssistances
  }
})

describe('updateApplication', () => {
  test('it should submit application to shortForm endpoint', async () => {
    const applicationDomain = supplementalApplication
    updateApplication(applicationDomain)
      .then(response => {
        expect(response.id).toEqual(supplementalApplication.id)
        expect(mockSubmitAppFn.mock.calls.length).toEqual(1)
        expect(mockSubmitAppFn.mock.calls[0][0]).toEqual(applicationDomain)
      })
  })

  test('it should submit lease to backend if lease is present in application', async () => {
    const application = {
      'id': 'appID',
      'name': 'APP-12345',
      'listing_id': 'listingID',
      'lease': {
        'id': 'leaseID'
      }
    }

    updateApplication(application)
      .then(response => {
        expect(response.id).toEqual(application.id)
        expect(response.listing_id).toEqual(application.listing_id)
        expect(response.lease.id).toEqual(application.lease.id)
        expect(mockSubmitAppFn.mock.calls.length).toEqual(1)
        expect(mockCreateLeaseFn.mock.calls.length).toEqual(0)
        expect(mockUpdateLeaseFn.mock.calls.length).toEqual(1)
      })
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

    updateApplication(application)
      .then(response => {
        expect(response.id).toEqual(application.id)
        expect(response.lease).toEqual({})
        expect(mockSubmitAppFn.mock.calls.length).toEqual(1)
        expect(mockCreateLeaseFn.mock.calls.length).toEqual(0)
        expect(mockUpdateLeaseFn.mock.calls.length).toEqual(0)
      })
  })

  test('it should create and update rental assistances', async () => {
    const baseApplication = {
      'id': 'appID',
      'name': 'APP-12345',
      'listing': {
        'id': 'listingID'
      },
      'rental_assistances': [
        { id: 'abc1', assistance_amount: 11, recipient: 'recipient' },
        { id: 'abc2', assistance_amount: 22, recipient: 'recipient2' }
      ]
    }
    const application = cloneDeep(baseApplication)
    application.rental_assistances[0].assistance_amount = 22
    application.rental_assistances[2] = { assistance_amount: 22, recipient: 'recipient3' }

    updateApplication(application, baseApplication)
      .then(response => {
        expect(response.id).toEqual(application.id)
        expect(response.id).toEqual(application.id)
        expect(mockCreateRentalFn.mock.calls.length).toEqual(1)
        expect(mockUpdateRentalFn.mock.calls.length).toEqual(1)
      })
  })
})
