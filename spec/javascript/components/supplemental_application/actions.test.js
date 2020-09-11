import {
  saveLeaseAndAssistances,
  updateApplication,
  updateApplicationAndAddComment
} from 'components/supplemental_application/actions'
import supplementalApplication from '../../fixtures/supplemental_application'
import { cloneDeep } from 'lodash'

const mockSubmitAppFn = jest.fn()
const mockCreateLeaseFn = jest.fn()
const mockUpdateLeaseFn = jest.fn()
const mockCreateRentalFn = jest.fn()
const mockUpdateRentalFn = jest.fn()
const mockCreateFieldUpdateCommentFn = jest.fn()
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

  const mockCreateFieldUpdateComment = async (id, status, comment, substatus) => {
    mockCreateFieldUpdateCommentFn(id, status, comment, substatus)
    return ['status_history_item']
  }

  return {
    submitApplication: mockSubmitApplication,
    createLease: mockCreateLease,
    updateLease: mockUpdateLease,
    createRentalAssistance: mockCreateRental,
    updateRentalAssistance: mockUpdateRental,
    getRentalAssistances: mockGetRentalAssistances,
    createFieldUpdateComment: mockCreateFieldUpdateComment
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

  test('it should not submit lease to backend if lease is unchanged', async () => {
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

    const prevApplication = {
      ...application,
      name: 'APP-prev'
    }

    const response = await updateApplication(application, prevApplication)
    expect(response.id).toEqual(application.id)
    expect(response.lease.id).toEqual('leaseID')
    expect(mockSubmitAppFn.mock.calls.length).toEqual(1)
    expect(mockCreateLeaseFn.mock.calls.length).toEqual(0)
    expect(mockUpdateLeaseFn.mock.calls.length).toEqual(0)
  })

  test('it should not submit application to backend if application is unchanged', async () => {
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

    updateApplication(application, application)
      .then(response => {
        expect(response).toEqual(application)
        expect(mockSubmitAppFn.mock.calls.length).toEqual(0)
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
        expect(mockCreateRentalFn.mock.calls.length).toEqual(1)
        expect(mockUpdateRentalFn.mock.calls.length).toEqual(1)
      })
  })
})

describe('updateApplicationAndAddComment', () => {
  test('it should update the application and add a field update comment', async () => {
    const application = {
      'id': 'appID',
      'name': 'APP-12345',
      'listing': {
        'id': 'listingID'
      },
      'lease': {}
    }

    const status = 'Approved'

    updateApplicationAndAddComment(application, application, status)
      .then(response => {
        expect(response.application.id).toEqual(application.id)
        expect(response.statusHistory).toEqual(['status_history_item'])
        expect(mockSubmitAppFn.mock.calls.length).toEqual(1)
        expect(mockCreateLeaseFn.mock.calls.length).toEqual(1)
        expect(mockCreateFieldUpdateCommentFn.mock.calls.length).toEqual(1)
        expect(mockCreateFieldUpdateCommentFn).toHaveBeenCalledWith('appID', 'Approved')
      })
  })
})

describe('saveLeaseAndAssistances', () => {
  const assistance1 = { id: 'rentalAssistanceID1', type: 'rentalAssistanceType' }
  const assistanceNoId = { type: 'rentalAssistanceType' }

  const leaseWithId = { id: 'leaseId' }
  const leaseWithId2 = { id: 'leaseId2' }
  const leaseNoId = { otherLeaseField: 'otherLeaseField' }

  const application = { id: 'appID' }

  const appWith = ({ lease, assistances }) => ({
    ...application,
    lease,
    rental_assistances: assistances
  })

  describe('when the current application doesnt have a lease or assistances', () => {
    const currentApp = appWith({ lease: {}, assistances: [] })
    describe('when the previous application doesnt have a lease or assistances', () => {
      const prevApp = appWith({ lease: {}, assistances: [] })
      beforeEach(async () => {
        await saveLeaseAndAssistances(currentApp, prevApp)
      })

      test('it does not save anything', async () => {
        expect(mockCreateLeaseFn.mock.calls.length).toEqual(0)
        expect(mockUpdateLeaseFn.mock.calls.length).toEqual(0)
        expect(mockCreateRentalFn.mock.calls.length).toEqual(0)
        expect(mockUpdateRentalFn.mock.calls.length).toEqual(0)
        expect(mockGetRentalAssistancesFn.mock.calls.length).toEqual(0)
      })
    })

    describe('when the previous application does have a lease', () => {
      describe('when the previous application does not have assistances', () => {
        const prevApp = appWith({ lease: leaseWithId, assistances: [] })
        beforeEach(async () => {
          await saveLeaseAndAssistances(currentApp, prevApp)
        })

        test('it does not save anything', async () => {
          expect(mockCreateLeaseFn.mock.calls.length).toEqual(0)
          expect(mockUpdateLeaseFn.mock.calls.length).toEqual(0)
          expect(mockCreateRentalFn.mock.calls.length).toEqual(0)
          expect(mockUpdateRentalFn.mock.calls.length).toEqual(0)
          expect(mockGetRentalAssistancesFn.mock.calls.length).toEqual(0)
        })
      })

      describe('when the previous application does have assistances', () => {
        const prevApp = appWith({ lease: leaseWithId, assistances: [assistance1] })
        beforeEach(async () => {
          await saveLeaseAndAssistances(currentApp, prevApp)
        })

        test('it does not save anything', async () => {
          expect(mockCreateLeaseFn.mock.calls.length).toEqual(0)
          expect(mockUpdateLeaseFn.mock.calls.length).toEqual(0)
          expect(mockCreateRentalFn.mock.calls.length).toEqual(0)
          expect(mockUpdateRentalFn.mock.calls.length).toEqual(0)
          expect(mockGetRentalAssistancesFn.mock.calls.length).toEqual(0)
        })
      })
    })
  })

  describe('when the current application has a lease with an id and no assistances', () => {
    const currentApp = appWith({ lease: leaseWithId, assistances: [] })

    describe('when the other app is null', () => {
      const prevApp = null
      let response

      beforeEach(async () => {
        response = await saveLeaseAndAssistances(currentApp, prevApp)
      })

      it('only triggers a lease update request', () => {
        expect(mockCreateLeaseFn.mock.calls.length).toEqual(0)
        expect(mockUpdateLeaseFn.mock.calls.length).toEqual(1)
        expect(mockCreateRentalFn.mock.calls.length).toEqual(0)
        expect(mockUpdateRentalFn.mock.calls.length).toEqual(0)
        expect(mockGetRentalAssistancesFn.mock.calls.length).toEqual(0)
      })

      it('returns the correct lease response', () => {
        expect(response.lease).toEqual(leaseWithId)
      })

      it('returns the correct assistances response', () => {
        expect(response.rentalAssistances).toEqual([])
      })
    })

    describe('when the other app has no lease or assistances', () => {
      const prevApp = appWith({ lease: {}, assistances: [] })
      let response

      beforeEach(async () => {
        response = await saveLeaseAndAssistances(currentApp, prevApp)
      })

      it('only triggers a lease update request', () => {
        expect(mockCreateLeaseFn.mock.calls.length).toEqual(0)
        expect(mockUpdateLeaseFn.mock.calls.length).toEqual(1)
        expect(mockCreateRentalFn.mock.calls.length).toEqual(0)
        expect(mockUpdateRentalFn.mock.calls.length).toEqual(0)
        expect(mockGetRentalAssistancesFn.mock.calls.length).toEqual(0)
      })

      it('returns the correct lease response', () => {
        expect(response.lease).toEqual(leaseWithId)
      })

      it('returns the correct assistances response', () => {
        expect(response.rentalAssistances).toEqual([])
      })
    })

    describe('when the other app has the same lease and no assistances', () => {
      const prevApp = appWith({ lease: leaseWithId, assistances: [] })
      let response

      beforeEach(async () => {
        response = await saveLeaseAndAssistances(currentApp, prevApp)
      })

      it('does not trigger any requests', () => {
        expect(mockCreateLeaseFn.mock.calls.length).toEqual(0)
        expect(mockUpdateLeaseFn.mock.calls.length).toEqual(0)
        expect(mockCreateRentalFn.mock.calls.length).toEqual(0)
        expect(mockUpdateRentalFn.mock.calls.length).toEqual(0)
        expect(mockGetRentalAssistancesFn.mock.calls.length).toEqual(0)
      })

      it('returns the correct lease response', () => {
        expect(response.lease).toEqual(leaseWithId)
      })

      it('returns the correct assistances response', () => {
        expect(response.rentalAssistances).toEqual([])
      })
    })

    describe('when the other app has a different lease and no assistances', () => {
      const prevApp = appWith({ lease: leaseWithId2, assistances: [] })
      let response

      beforeEach(async () => {
        response = await saveLeaseAndAssistances(currentApp, prevApp)
      })

      it('only updates the lease', () => {
        expect(mockCreateLeaseFn.mock.calls.length).toEqual(0)
        expect(mockUpdateLeaseFn.mock.calls.length).toEqual(1)
        expect(mockCreateRentalFn.mock.calls.length).toEqual(0)
        expect(mockUpdateRentalFn.mock.calls.length).toEqual(0)
        expect(mockGetRentalAssistancesFn.mock.calls.length).toEqual(0)
      })

      it('returns the correct lease response', () => {
        expect(response.lease).toEqual(leaseWithId)
      })

      it('returns the correct assistances response', () => {
        expect(response.rentalAssistances).toEqual([])
      })
    })
  })

  describe('when the current application has a lease without an id', () => {
    const currentApp = appWith({ lease: leaseNoId, assistances: [] })

    describe('when the other app is null', () => {
      const prevApp = null
      let response

      beforeEach(async () => {
        response = await saveLeaseAndAssistances(currentApp, prevApp)
      })

      it('only triggers a lease create request', () => {
        expect(mockCreateLeaseFn.mock.calls.length).toEqual(1)
        expect(mockUpdateLeaseFn.mock.calls.length).toEqual(0)
        expect(mockCreateRentalFn.mock.calls.length).toEqual(0)
        expect(mockUpdateRentalFn.mock.calls.length).toEqual(0)
        expect(mockGetRentalAssistancesFn.mock.calls.length).toEqual(0)
      })

      it('returns the correct lease response', () => {
        expect(response.lease).toEqual(leaseNoId)
      })

      it('returns the correct assistances response', () => {
        expect(response.rentalAssistances).toEqual([])
      })
    })

    describe('when the other app has no lease or assistances', () => {
      const prevApp = appWith({ lease: {}, assistances: [] })
      let response

      beforeEach(async () => {
        response = await saveLeaseAndAssistances(currentApp, prevApp)
      })

      it('only triggers a lease create request', () => {
        expect(mockCreateLeaseFn.mock.calls.length).toEqual(1)
        expect(mockUpdateLeaseFn.mock.calls.length).toEqual(0)
        expect(mockCreateRentalFn.mock.calls.length).toEqual(0)
        expect(mockUpdateRentalFn.mock.calls.length).toEqual(0)
        expect(mockGetRentalAssistancesFn.mock.calls.length).toEqual(0)
      })

      it('returns the correct lease response', () => {
        expect(response.lease).toEqual(leaseNoId)
      })

      it('returns the correct assistances response', () => {
        expect(response.rentalAssistances).toEqual([])
      })
    })

    describe('when the other app has the same lease and no assistances', () => {
      const prevApp = appWith({ lease: leaseNoId, assistances: [] })
      let response

      beforeEach(async () => {
        response = await saveLeaseAndAssistances(currentApp, prevApp)
      })

      it('does not trigger any requests', () => {
        expect(mockCreateLeaseFn.mock.calls.length).toEqual(0)
        expect(mockUpdateLeaseFn.mock.calls.length).toEqual(0)
        expect(mockCreateRentalFn.mock.calls.length).toEqual(0)
        expect(mockUpdateRentalFn.mock.calls.length).toEqual(0)
        expect(mockGetRentalAssistancesFn.mock.calls.length).toEqual(0)
      })

      it('returns the correct lease response', () => {
        expect(response.lease).toEqual(leaseNoId)
      })

      it('returns the correct assistances response', () => {
        expect(response.rentalAssistances).toEqual([])
      })
    })

    describe('when the other app has a different lease and no assistances', () => {
      const prevApp = appWith({ lease: leaseWithId2, assistances: [] })
      let response

      beforeEach(async () => {
        response = await saveLeaseAndAssistances(currentApp, prevApp)
      })

      it('only creates the new lease', () => {
        expect(mockCreateLeaseFn.mock.calls.length).toEqual(1)
        expect(mockUpdateLeaseFn.mock.calls.length).toEqual(0)
        expect(mockCreateRentalFn.mock.calls.length).toEqual(0)
        expect(mockUpdateRentalFn.mock.calls.length).toEqual(0)
        expect(mockGetRentalAssistancesFn.mock.calls.length).toEqual(0)
      })

      it('returns the correct lease response', () => {
        expect(response.lease).toEqual(leaseNoId)
      })

      it('returns the correct assistances response', () => {
        expect(response.rentalAssistances).toEqual([])
      })
    })
  })

  describe('when the current application has a new assistance', () => {
    const currentApp = appWith({ lease: leaseWithId, assistances: [assistanceNoId, assistance1] })
    const prevApp = appWith({ lease: leaseWithId, assistances: [assistance1] })
    let response

    beforeEach(async () => {
      response = await saveLeaseAndAssistances(currentApp, prevApp)
    })

    it('only triggers an assistance create request', () => {
      expect(mockCreateLeaseFn.mock.calls.length).toEqual(0)
      expect(mockUpdateLeaseFn.mock.calls.length).toEqual(0)
      expect(mockCreateRentalFn.mock.calls.length).toEqual(1)
      expect(mockUpdateRentalFn.mock.calls.length).toEqual(0)
      expect(mockGetRentalAssistancesFn.mock.calls.length).toEqual(1)
    })

    it('returns the correct lease response', () => {
      expect(response.lease).toEqual(leaseWithId)
    })
  })

  describe('when the current application has an edited assistance', () => {
    const currentApp = appWith({ lease: leaseWithId, assistances: [{ ...assistance1, newField: 'newFieldValue' }] })
    const prevApp = appWith({ lease: leaseWithId, assistances: [assistance1] })
    let response

    beforeEach(async () => {
      response = await saveLeaseAndAssistances(currentApp, prevApp)
    })

    it('only triggers an assistance create request', () => {
      expect(mockCreateLeaseFn.mock.calls.length).toEqual(0)
      expect(mockUpdateLeaseFn.mock.calls.length).toEqual(0)
      expect(mockCreateRentalFn.mock.calls.length).toEqual(0)
      expect(mockUpdateRentalFn.mock.calls.length).toEqual(1)
      expect(mockGetRentalAssistancesFn.mock.calls.length).toEqual(1)
    })

    it('returns the correct lease response', () => {
      expect(response.lease).toEqual(leaseWithId)
    })
  })
})
