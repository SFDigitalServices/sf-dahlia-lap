import {
  leaseCreated,
  leaseEditClicked,
  leaseCanceled
} from 'components/supplemental_application/actions/leaseActionCreators'
import LEASE_STATES from 'components/supplemental_application/utils/leaseSectionStates'
import ACTIONS from 'context/actions'

const MOCK_DISPATCH = jest.fn()

const getFiredActions = (dispatchMock) => dispatchMock.mock.calls.map((call) => call[0])

describe('leaseActionCreators', () => {
  let firedActions = []
  beforeEach(() => {
    firedActions = []
  })

  describe('leaseCreated', () => {
    beforeEach(() => {
      leaseCreated(MOCK_DISPATCH)
      firedActions = getFiredActions(MOCK_DISPATCH)
    })

    test('only fires one action', () => {
      expect(firedActions).toHaveLength(1)
    })

    test('sends the correct action type', () => {
      expect(firedActions[0].type).toEqual(ACTIONS.LEASE_SECTION_STATE_CHANGED)
    })

    test('sends the correct action data', () => {
      expect(firedActions[0].data).toEqual(LEASE_STATES.EDIT_LEASE)
    })
  })

  describe('leaseEditClicked', () => {
    beforeEach(() => {
      leaseEditClicked(MOCK_DISPATCH)
      firedActions = getFiredActions(MOCK_DISPATCH)
    })

    test('only fires one action', () => {
      expect(firedActions).toHaveLength(1)
    })

    test('sends the correct action type', () => {
      expect(firedActions[0].type).toEqual(ACTIONS.LEASE_SECTION_STATE_CHANGED)
    })

    test('sends the correct action data', () => {
      expect(firedActions[0].data).toEqual(LEASE_STATES.EDIT_LEASE)
    })
  })

  describe('leaseCanceled', () => {
    describe('when the application has a lease', () => {
      beforeEach(() => {
        leaseCanceled(MOCK_DISPATCH, {
          id: 'applicationWithLease',
          lease: {
            id: 'leaseId'
          }
        })
        firedActions = getFiredActions(MOCK_DISPATCH)
      })

      test('only fires one action', () => {
        expect(firedActions).toHaveLength(1)
      })

      test('sends the correct action type', () => {
        expect(firedActions[0].type).toEqual(ACTIONS.LEASE_SECTION_STATE_CHANGED)
      })

      test('sends the correct action data', () => {
        expect(firedActions[0].data).toEqual(LEASE_STATES.SHOW_LEASE)
      })
    })

    describe('when the application does not have a lease', () => {
      beforeEach(() => {
        leaseCanceled(MOCK_DISPATCH, {
          id: 'applicationWithoutLease'
        })
        firedActions = getFiredActions(MOCK_DISPATCH)
      })

      test('only fires one action', () => {
        expect(firedActions).toHaveLength(1)
      })

      test('sends the correct action type', () => {
        expect(firedActions[0].type).toEqual(ACTIONS.LEASE_SECTION_STATE_CHANGED)
      })

      test('sends the correct action data', () => {
        expect(firedActions[0].data).toEqual(LEASE_STATES.NO_LEASE)
      })
    })
  })
})
