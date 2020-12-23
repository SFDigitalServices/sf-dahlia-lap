import mockedApiService from 'apiService'
import {
  createRentalAssistance,
  updateRentalAssistance,
  deleteRentalAssistance
} from 'components/supplemental_application/actions/rentalAssistanceActionCreators'
import ACTIONS from 'context/actions'

jest.mock('apiService', () => require('../mocks/mockApiService'))

const MOCK_DISPATCH = jest.fn()

const getFiredActions = (dispatchMock) => dispatchMock.mock.calls.map((call) => call[0])

const SERVICE_NAMES = ['createRentalAssistance', 'updateRentalAssistance', 'deleteRentalAssistance']

const getCallCounts = () =>
  Object.fromEntries(SERVICE_NAMES.map((name) => [name, mockedApiService[name].mock.calls.length]))

const getExpectedCallCounts = (expectedServiceCallName) =>
  Object.fromEntries(SERVICE_NAMES.map((name) => [name, name === expectedServiceCallName ? 1 : 0]))

describe('rentalAssistanceActionCreators', () => {
  let firedActions = []
  beforeEach(() => {
    firedActions = []
  })

  describe('createRentalAssistance', () => {
    beforeEach(async () => {
      await createRentalAssistance(MOCK_DISPATCH, 'applicationId', {
        assistance_amount: '11'
      })
      firedActions = getFiredActions(MOCK_DISPATCH)
    })

    test('fires three actions', () => {
      expect(firedActions).toHaveLength(3)
    })

    test('called the correct apiService function', () => {
      expect(getCallCounts()).toEqual(getExpectedCallCounts('createRentalAssistance'))
    })

    test('sends the correct actions', () => {
      expect(firedActions).toEqual([
        { type: ACTIONS.SUPP_APP_LOAD_START, data: null },
        {
          type: ACTIONS.RENTAL_ASSISTANCE_CREATE_SUCCESS,
          data: {
            newRentalAssistance: {
              id: 'newRentalAssistanceId',
              assistance_amount: '$11.00'
            }
          }
        },
        { type: ACTIONS.SUPP_APP_LOAD_COMPLETE, data: null }
      ])
    })
  })

  describe('updateRentalAssistance', () => {
    beforeEach(async () => {
      await updateRentalAssistance(MOCK_DISPATCH, 'applicationId', {
        id: 'assistanceId',
        assistance_amount: '12'
      })
      firedActions = getFiredActions(MOCK_DISPATCH)
    })

    test('fires three actions', () => {
      expect(firedActions).toHaveLength(3)
    })

    test('called the correct apiService function', () => {
      expect(getCallCounts()).toEqual(getExpectedCallCounts('updateRentalAssistance'))
    })

    test('sends the correct actions', () => {
      expect(firedActions).toEqual([
        { type: ACTIONS.SUPP_APP_LOAD_START, data: null },
        {
          type: ACTIONS.RENTAL_ASSISTANCE_UPDATE_SUCCESS,
          data: {
            updatedRentalAssistance: {
              id: 'assistanceId',
              assistance_amount: '$12.00'
            }
          }
        },
        { type: ACTIONS.SUPP_APP_LOAD_COMPLETE, data: null }
      ])
    })
  })

  describe('deleteRentalAssistance', () => {
    beforeEach(async () => {
      await deleteRentalAssistance(MOCK_DISPATCH, 'assistanceIdToDelete')
      firedActions = getFiredActions(MOCK_DISPATCH)
    })

    test('fires three actions', () => {
      expect(firedActions).toHaveLength(3)
    })

    test('called the correct apiService function', () => {
      expect(getCallCounts()).toEqual(getExpectedCallCounts('deleteRentalAssistance'))
    })

    test('sends the correct actions', () => {
      expect(firedActions).toEqual([
        { type: ACTIONS.SUPP_APP_LOAD_START, data: null },
        {
          type: ACTIONS.RENTAL_ASSISTANCE_DELETE_SUCCESS,
          data: {
            assistanceId: 'assistanceIdToDelete'
          }
        },
        { type: ACTIONS.SUPP_APP_LOAD_COMPLETE, data: null }
      ])
    })
  })
})
