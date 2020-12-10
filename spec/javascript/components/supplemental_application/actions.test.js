import { cloneDeep } from 'lodash'

import {
  deleteLease,
  getSupplementalPageData,
  saveLeaseAndAssistances,
  updateApplication,
  updateApplicationAndAddComment
} from 'components/supplemental_application/actions'

import supplementalApplication from '../../fixtures/supplemental_application'

const mockSubmitAppFn = jest.fn()
const mockCreateLeaseFn = jest.fn()
const mockGetLeaseFn = jest.fn()
const mockGetStatusHistoryFn = jest.fn()
const mockGetSupplementalApplicationFn = jest.fn()
const mockGetUnitsFn = jest.fn()
const mockGetListingFn = jest.fn()
const mockDeleteLeaseFn = jest.fn()
const mockUpdateLeaseFn = jest.fn()
const mockCreateRentalFn = jest.fn()
const mockUpdateRentalFn = jest.fn()
const mockCreateFieldUpdateCommentFn = jest.fn()
const mockGetRentalAssistancesFn = jest.fn()

jest.mock('apiService', () => {
  const _supplementalApplication = require('../../fixtures/supplemental_application').default

  const mockGetLease = async (applicationId) => {
    mockGetLeaseFn(applicationId)
    return _supplementalApplication.lease
  }

  const mockGetUnits = async (listingId) => {
    mockGetUnitsFn(listingId)
    return {
      units: []
    }
  }

  const mockGetListing = async (listingId) => {
    mockGetListingFn(listingId)
    return { id: listingId }
  }

  const mockGetStatusHistory = async (applicationId) => {
    mockGetStatusHistoryFn(applicationId)
    return []
  }

  const mockGetSupplementalApplication = async (applicationId) => {
    mockGetSupplementalApplicationFn(applicationId)
    return {
      application: { ..._supplementalApplication, lease: null, rental_assistances: null },
      fileBaseUrl: 'fileBaseUrl'
    }
  }

  const mockSubmitApplication = async (application) => {
    mockSubmitAppFn(application)
    return application
  }

  const mockCreateLease = async (lease) => {
    mockCreateLeaseFn(lease)
    return lease
  }

  const mockDeleteLease = async (applicationId, leaseId) => {
    mockDeleteLeaseFn(applicationId, leaseId)
    return true
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
    return _supplementalApplication.rental_assistances
  }

  const mockCreateFieldUpdateComment = async (id, status, comment, substatus) => {
    mockCreateFieldUpdateCommentFn(id, status, comment, substatus)
    return ['status_history_item']
  }

  return {
    submitApplication: mockSubmitApplication,
    getLease: mockGetLease,
    getUnits: mockGetUnits,
    getLeaseUpListing: mockGetListing,
    getStatusHistory: mockGetStatusHistory,
    getSupplementalApplication: mockGetSupplementalApplication,
    createLease: mockCreateLease,
    deleteLease: mockDeleteLease,
    updateLease: mockUpdateLease,
    createRentalAssistance: mockCreateRental,
    updateRentalAssistance: mockUpdateRental,
    getRentalAssistances: mockGetRentalAssistances,
    createFieldUpdateComment: mockCreateFieldUpdateComment
  }
})

describe('getSupplementalPageData', () => {
  describe('when no listingId is passed', () => {
    let response
    beforeEach(async () => {
      response = await getSupplementalPageData('applicationId')
    })

    test('returns the correct response', () => {
      expect(response).toEqual({
        application: supplementalApplication,
        units: [],
        fileBaseUrl: 'fileBaseUrl',
        listing: { id: null }
      })
    })

    test('triggers separate requests', () => {
      expect(mockGetLeaseFn.mock.calls).toHaveLength(1)
      expect(mockGetSupplementalApplicationFn.mock.calls).toHaveLength(1)
      expect(mockGetRentalAssistancesFn.mock.calls).toHaveLength(1)
      expect(mockGetStatusHistoryFn.mock.calls).toHaveLength(1)
      expect(mockGetUnitsFn.mock.calls).toHaveLength(1)
    })

    test('calls getUnits with the supplemental application listing id', () => {
      expect(mockGetUnitsFn.mock.calls[0][1]).toEqual(supplementalApplication.listing.id)
    })
  })

  describe('when a listing ID is passed', () => {
    let response
    beforeEach(async () => {
      response = await getSupplementalPageData('applicationId', 'otherListingId')
    })

    test('returns the correct response', () => {
      expect(response).toEqual({
        application: supplementalApplication,
        units: [],
        fileBaseUrl: 'fileBaseUrl',
        listing: { id: 'otherListingId' }
      })
    })

    test('triggers separate requests', () => {
      expect(mockGetLeaseFn.mock.calls).toHaveLength(1)
      expect(mockGetSupplementalApplicationFn.mock.calls).toHaveLength(1)
      expect(mockGetRentalAssistancesFn.mock.calls).toHaveLength(1)
      expect(mockGetStatusHistoryFn.mock.calls).toHaveLength(1)
      expect(mockGetUnitsFn.mock.calls).toHaveLength(1)
    })

    test('calls getUnits with the supplied listing id', () => {
      expect(mockGetUnitsFn.mock.calls[0][1]).toEqual('otherListingId')
    })
  })
})

describe('updateApplication', () => {
  test('it should submit application to shortForm endpoint', async () => {
    const applicationDomain = supplementalApplication
    const response = await updateApplication(applicationDomain)
    expect(response.id).toEqual(supplementalApplication.id)
    expect(mockSubmitAppFn.mock.calls).toHaveLength(1)
    expect(mockSubmitAppFn.mock.calls[0][0]).toEqual(applicationDomain)
  })

  test('it should submit lease to backend if lease is present in application', async () => {
    const application = {
      id: 'appID',
      name: 'APP-12345',
      listing_id: 'listingID',
      lease: {
        id: 'leaseID'
      }
    }

    const response = await updateApplication(application, null, true)
    expect(response.id).toEqual(application.id)
    expect(response.listing_id).toEqual(application.listing_id)
    expect(response.lease.id).toEqual(application.lease.id)
    expect(mockSubmitAppFn.mock.calls).toHaveLength(1)
    expect(mockCreateLeaseFn.mock.calls).toHaveLength(0)
    expect(mockUpdateLeaseFn.mock.calls).toHaveLength(1)
  })

  test('it should not submit lease to backend if alsoSavelease is false', async () => {
    const application = {
      id: 'appID',
      name: 'APP-12345',
      listing_id: 'listingID',
      lease: {
        id: 'leaseID'
      }
    }

    const prevApplication = {
      id: 'appID',
      name: 'APP-123452',
      listing_id: 'listingID2',
      lease: {
        id: 'leaseID2'
      }
    }

    const response = await updateApplication(application, prevApplication, false)
    expect(response.id).toEqual(application.id)
    expect(response.listing_id).toEqual(application.listing_id)
    expect(response.lease.id).toEqual(prevApplication.lease.id)
    expect(mockSubmitAppFn.mock.calls).toHaveLength(1)
    expect(mockCreateLeaseFn.mock.calls).toHaveLength(0)
    expect(mockUpdateLeaseFn.mock.calls).toHaveLength(0)
  })

  test('it should submit lease to backend even if lease is empty', async () => {
    const application = {
      id: 'appID',
      name: 'APP-12345',
      listing: {
        id: 'listingID'
      },
      lease: {}
    }

    const response = await updateApplication(application, null, true)
    expect(response.id).toEqual(application.id)
    expect(response.lease).toEqual({})
    expect(mockSubmitAppFn.mock.calls).toHaveLength(1)
    expect(mockCreateLeaseFn.mock.calls).toHaveLength(1)
    expect(mockUpdateLeaseFn.mock.calls).toHaveLength(0)
  })

  test('it should not submit lease to backend if lease is unchanged', async () => {
    const application = {
      id: 'appID',
      name: 'APP-12345',
      listing: {
        id: 'listingID'
      },
      lease: {
        id: 'leaseID'
      }
    }

    const prevApplication = {
      ...application,
      name: 'APP-prev'
    }

    const response = await updateApplication(application, prevApplication, true)
    expect(response.id).toEqual(application.id)
    expect(response.lease.id).toEqual('leaseID')
    expect(mockSubmitAppFn.mock.calls).toHaveLength(1)
    expect(mockCreateLeaseFn.mock.calls).toHaveLength(0)
    expect(mockUpdateLeaseFn.mock.calls).toHaveLength(0)
  })

  test('it should not submit application to backend if application is unchanged', async () => {
    const application = {
      id: 'appID',
      name: 'APP-12345',
      listing: {
        id: 'listingID'
      },
      lease: {
        id: 'leaseID'
      },
      rental_assistances: []
    }

    const response = await updateApplication(application, application, true)
    expect(response).toEqual(application)
    expect(mockSubmitAppFn.mock.calls).toHaveLength(0)
    expect(mockCreateLeaseFn.mock.calls).toHaveLength(0)
    expect(mockUpdateLeaseFn.mock.calls).toHaveLength(0)
  })

  test('it should create and update rental assistances', async () => {
    const baseApplication = {
      id: 'appID',
      name: 'APP-12345',
      listing: {
        id: 'listingID'
      },
      lease: { id: 'leaseId' },
      rental_assistances: [
        { id: 'abc1', assistance_amount: 11, recipient: 'recipient' },
        { id: 'abc2', assistance_amount: 22, recipient: 'recipient2' }
      ]
    }
    const application = cloneDeep(baseApplication)
    application.rental_assistances[0].assistance_amount = 22
    application.rental_assistances[2] = { assistance_amount: 22, recipient: 'recipient3' }

    const response = await updateApplication(application, baseApplication, true)
    expect(response.id).toEqual(application.id)
    expect(mockCreateRentalFn.mock.calls).toHaveLength(1)
    expect(mockUpdateRentalFn.mock.calls).toHaveLength(1)
  })
})

describe('updateApplicationAndAddComment', () => {
  const newStatus = 'Approved'

  const application = {
    id: 'appID',
    name: 'APP-12345',
    listing: {
      id: 'listingID'
    },
    lease: {}
  }

  const prevApp = {
    ...application,
    name: 'prev-app'
  }

  describe('when the request should also create a lease', () => {
    let response
    beforeEach(async () => {
      response = await updateApplicationAndAddComment(
        application,
        prevApp,
        newStatus,
        null,
        null,
        true
      )
    })

    test('it should return the correct response', async () => {
      expect(response.application.id).toEqual(application.id)
      expect(response.statusHistory).toEqual(['status_history_item'])
    })

    test('it should update the application and add a field update comment', async () => {
      expect(mockSubmitAppFn.mock.calls).toHaveLength(1)
      expect(mockCreateFieldUpdateCommentFn.mock.calls).toHaveLength(1)
    })

    test('it should create a lease', async () => {
      expect(mockCreateLeaseFn.mock.calls).toHaveLength(1)
      expect(mockUpdateLeaseFn.mock.calls).toHaveLength(0)
    })

    test('it should pass the correct params to the field update request', async () => {
      expect(mockCreateFieldUpdateCommentFn).toHaveBeenCalledWith('appID', newStatus, null, null)
    })
  })

  describe('when the request should not also create a lease', () => {
    let response
    beforeEach(async () => {
      response = await updateApplicationAndAddComment(
        application,
        prevApp,
        newStatus,
        null,
        null,
        false
      )
    })

    test('it should return the correct response', async () => {
      expect(response.application.id).toEqual(application.id)
      expect(response.statusHistory).toEqual(['status_history_item'])
    })

    test('it should update the application and add a field update comment', async () => {
      expect(mockSubmitAppFn.mock.calls).toHaveLength(1)
      expect(mockCreateFieldUpdateCommentFn.mock.calls).toHaveLength(1)
    })

    test('it should not create a lease', async () => {
      expect(mockCreateLeaseFn.mock.calls).toHaveLength(0)
      expect(mockUpdateLeaseFn.mock.calls).toHaveLength(0)
    })

    test('it should pass the correct params to the field update request', async () => {
      expect(mockCreateFieldUpdateCommentFn).toHaveBeenCalledWith('appID', newStatus, null, null)
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

      test('it creates a lease', async () => {
        expect(mockCreateLeaseFn.mock.calls).toHaveLength(1)
        expect(mockUpdateLeaseFn.mock.calls).toHaveLength(0)
        expect(mockCreateRentalFn.mock.calls).toHaveLength(0)
        expect(mockUpdateRentalFn.mock.calls).toHaveLength(0)
        expect(mockGetRentalAssistancesFn.mock.calls).toHaveLength(0)
      })
    })

    describe('when the previous application does have a lease', () => {
      describe('when the previous application does not have assistances', () => {
        const prevApp = appWith({ lease: leaseWithId, assistances: [] })
        beforeEach(async () => {
          await saveLeaseAndAssistances(currentApp, prevApp)
        })

        test('it creates a lease', async () => {
          expect(mockCreateLeaseFn.mock.calls).toHaveLength(1)
          expect(mockUpdateLeaseFn.mock.calls).toHaveLength(0)
          expect(mockCreateRentalFn.mock.calls).toHaveLength(0)
          expect(mockUpdateRentalFn.mock.calls).toHaveLength(0)
          expect(mockGetRentalAssistancesFn.mock.calls).toHaveLength(0)
        })
      })

      describe('when the previous application does have assistances', () => {
        const prevApp = appWith({ lease: leaseWithId, assistances: [assistance1] })
        beforeEach(async () => {
          await saveLeaseAndAssistances(currentApp, prevApp)
        })

        test('it creates a lease', async () => {
          expect(mockCreateLeaseFn.mock.calls).toHaveLength(1)
          expect(mockUpdateLeaseFn.mock.calls).toHaveLength(0)
          expect(mockCreateRentalFn.mock.calls).toHaveLength(0)
          expect(mockUpdateRentalFn.mock.calls).toHaveLength(0)
          expect(mockGetRentalAssistancesFn.mock.calls).toHaveLength(0)
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
        expect(mockCreateLeaseFn.mock.calls).toHaveLength(0)
        expect(mockUpdateLeaseFn.mock.calls).toHaveLength(1)
        expect(mockCreateRentalFn.mock.calls).toHaveLength(0)
        expect(mockUpdateRentalFn.mock.calls).toHaveLength(0)
        expect(mockGetRentalAssistancesFn.mock.calls).toHaveLength(0)
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
        expect(mockCreateLeaseFn.mock.calls).toHaveLength(0)
        expect(mockUpdateLeaseFn.mock.calls).toHaveLength(1)
        expect(mockCreateRentalFn.mock.calls).toHaveLength(0)
        expect(mockUpdateRentalFn.mock.calls).toHaveLength(0)
        expect(mockGetRentalAssistancesFn.mock.calls).toHaveLength(0)
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
        expect(mockCreateLeaseFn.mock.calls).toHaveLength(0)
        expect(mockUpdateLeaseFn.mock.calls).toHaveLength(0)
        expect(mockCreateRentalFn.mock.calls).toHaveLength(0)
        expect(mockUpdateRentalFn.mock.calls).toHaveLength(0)
        expect(mockGetRentalAssistancesFn.mock.calls).toHaveLength(0)
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
        expect(mockCreateLeaseFn.mock.calls).toHaveLength(0)
        expect(mockUpdateLeaseFn.mock.calls).toHaveLength(1)
        expect(mockCreateRentalFn.mock.calls).toHaveLength(0)
        expect(mockUpdateRentalFn.mock.calls).toHaveLength(0)
        expect(mockGetRentalAssistancesFn.mock.calls).toHaveLength(0)
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
        expect(mockCreateLeaseFn.mock.calls).toHaveLength(1)
        expect(mockUpdateLeaseFn.mock.calls).toHaveLength(0)
        expect(mockCreateRentalFn.mock.calls).toHaveLength(0)
        expect(mockUpdateRentalFn.mock.calls).toHaveLength(0)
        expect(mockGetRentalAssistancesFn.mock.calls).toHaveLength(0)
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
        expect(mockCreateLeaseFn.mock.calls).toHaveLength(1)
        expect(mockUpdateLeaseFn.mock.calls).toHaveLength(0)
        expect(mockCreateRentalFn.mock.calls).toHaveLength(0)
        expect(mockUpdateRentalFn.mock.calls).toHaveLength(0)
        expect(mockGetRentalAssistancesFn.mock.calls).toHaveLength(0)
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

      test('it creates a lease', async () => {
        expect(mockCreateLeaseFn.mock.calls).toHaveLength(1)
        expect(mockUpdateLeaseFn.mock.calls).toHaveLength(0)
        expect(mockCreateRentalFn.mock.calls).toHaveLength(0)
        expect(mockUpdateRentalFn.mock.calls).toHaveLength(0)
        expect(mockGetRentalAssistancesFn.mock.calls).toHaveLength(0)
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
        expect(mockCreateLeaseFn.mock.calls).toHaveLength(1)
        expect(mockUpdateLeaseFn.mock.calls).toHaveLength(0)
        expect(mockCreateRentalFn.mock.calls).toHaveLength(0)
        expect(mockUpdateRentalFn.mock.calls).toHaveLength(0)
        expect(mockGetRentalAssistancesFn.mock.calls).toHaveLength(0)
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
      expect(mockCreateLeaseFn.mock.calls).toHaveLength(0)
      expect(mockUpdateLeaseFn.mock.calls).toHaveLength(0)
      expect(mockCreateRentalFn.mock.calls).toHaveLength(1)
      expect(mockUpdateRentalFn.mock.calls).toHaveLength(0)
      expect(mockGetRentalAssistancesFn.mock.calls).toHaveLength(1)
    })

    it('returns the correct lease response', () => {
      expect(response.lease).toEqual(leaseWithId)
    })
  })

  describe('when the current application has an edited assistance', () => {
    const currentApp = appWith({
      lease: leaseWithId,
      assistances: [{ ...assistance1, newField: 'newFieldValue' }]
    })
    const prevApp = appWith({ lease: leaseWithId, assistances: [assistance1] })
    let response

    beforeEach(async () => {
      response = await saveLeaseAndAssistances(currentApp, prevApp)
    })

    it('only triggers an assistance create request', () => {
      expect(mockCreateLeaseFn.mock.calls).toHaveLength(0)
      expect(mockUpdateLeaseFn.mock.calls).toHaveLength(0)
      expect(mockCreateRentalFn.mock.calls).toHaveLength(0)
      expect(mockUpdateRentalFn.mock.calls).toHaveLength(1)
      expect(mockGetRentalAssistancesFn.mock.calls).toHaveLength(1)
    })

    it('returns the correct lease response', () => {
      expect(response.lease).toEqual(leaseWithId)
    })
  })
})

describe('deleteLease', () => {
  const app = {
    id: 'applicationId',
    lease: {
      id: 'leaseId'
    }
  }

  let response

  beforeEach(async () => {
    response = await deleteLease(app)
  })

  test('returns true on success', async () => {
    expect(response).toBeTruthy()
  })

  test('calls apiService.deleteLease', async () => {
    expect(mockDeleteLeaseFn.mock.calls).toHaveLength(1)
  })

  test('calls apiService.deleteLease with the correct parameters', async () => {
    expect(mockDeleteLeaseFn.mock.calls[0]).toEqual(['applicationId', 'leaseId'])
  })
})
