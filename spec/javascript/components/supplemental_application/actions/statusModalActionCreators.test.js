import {
  openSuppAppAddCommentModal,
  closeSuppAppStatusModal,
  closeSuppAppStatusModalAlert,
  openSuppAppUpdateStatusModal,
  submitSuppAppStatusModal
} from 'components/supplemental_application/actions/statusModalActionCreators'
import LEASE_STATES from 'components/supplemental_application/utils/leaseSectionStates'
import ACTIONS from 'context/actions'

jest.mock(
  'components/supplemental_application/utils/supplementalRequestUtils',
  () => require('../mocks/mockSupplementalRequestUtils').default
)

const MOCK_DISPATCH = jest.fn()

const getFiredActions = (dispatchMock) => dispatchMock.mock.calls.map((call) => call[0])

describe('statusModalActionCreators', () => {
  let firedActions = []
  beforeEach(() => {
    firedActions = []
  })

  describe('closeSuppAppStatusModal', () => {
    beforeEach(async () => {
      await closeSuppAppStatusModal(MOCK_DISPATCH)
      firedActions = getFiredActions(MOCK_DISPATCH)
    })

    test('fires the correct action', () => {
      expect(firedActions).toEqual([
        {
          type: ACTIONS.STATUS_MODAL_UPDATED,
          data: {
            isOpen: false
          }
        }
      ])
    })
  })
  describe('closeSuppAppStatusModalAlert', () => {
    beforeEach(async () => {
      await closeSuppAppStatusModalAlert(MOCK_DISPATCH)
      firedActions = getFiredActions(MOCK_DISPATCH)
    })

    test('fires the correct action', () => {
      expect(firedActions).toEqual([
        {
          type: ACTIONS.STATUS_MODAL_UPDATED,
          data: {
            showAlert: false
          }
        }
      ])
    })
  })

  describe('openSuppAppUpdateStatusModal', () => {
    beforeEach(async () => {
      await openSuppAppUpdateStatusModal(MOCK_DISPATCH, 'testNewStatus')
      firedActions = getFiredActions(MOCK_DISPATCH)
    })

    test('sends the correct actions', () => {
      expect(firedActions).toEqual([
        {
          type: ACTIONS.STATUS_MODAL_UPDATED,
          data: {
            alertMsg: null,
            loading: false,
            showAlert: false,
            isInAddCommentMode: false,
            isOpen: true,
            status: 'testNewStatus',
            substatus: null
          }
        }
      ])
    })
  })

  describe('openSuppAppAddCommentModal', () => {
    describe('with empty history', () => {
      beforeEach(async () => {
        await openSuppAppAddCommentModal(MOCK_DISPATCH, [])
        firedActions = getFiredActions(MOCK_DISPATCH)
      })

      test('sends the correct actions', () => {
        expect(firedActions).toEqual([
          {
            type: ACTIONS.STATUS_MODAL_UPDATED,
            data: {
              alertMsg: null,
              loading: false,
              showAlert: false,
              isInAddCommentMode: true,
              isOpen: true,
              // status and substatus are null when history is empty
              status: null,
              substatus: null
            }
          }
        ])
      })
    })

    describe('with non-empty history', () => {
      beforeEach(async () => {
        await openSuppAppAddCommentModal(MOCK_DISPATCH, [
          { status: 'testStatus', substatus: 'testsubstatus' }
        ])
        firedActions = getFiredActions(MOCK_DISPATCH)
      })

      test('sends the correct actions', () => {
        expect(firedActions).toEqual([
          {
            type: ACTIONS.STATUS_MODAL_UPDATED,
            data: {
              alertMsg: null,
              loading: false,
              showAlert: false,
              isInAddCommentMode: true,
              isOpen: true,
              status: 'testStatus',
              substatus: 'testsubstatus'
            }
          }
        ])
      })
    })
  })

  describe('submitSuppAppStatusModal', () => {
    beforeEach(async () => {
      await submitSuppAppStatusModal(
        MOCK_DISPATCH,
        {
          status: 'testStatus',
          substatus: 'testsubstatus',
          comment: 'testComment'
        },
        {},
        [],
        LEASE_STATES.EDIT_LEASE
      )
      firedActions = getFiredActions(MOCK_DISPATCH)
    })

    test('sends the correct actions', () => {
      expect(firedActions).toEqual([
        { type: ACTIONS.SUPP_APP_LOAD_START, data: { statusModal: { loading: true } } },
        {
          type: ACTIONS.SUPP_APP_LOAD_SUCCESS,
          data: {
            application: {
              id: 'updatedApplicationId'
            },
            leaseSectionState: LEASE_STATES.SHOW_LEASE,
            statusHistory: [],
            statusModal: {
              isOpen: false
            },
            confirmedPreferencesFailed: false,
            preferenceRowsOpened: new Set(),
            assistanceRowsOpened: new Set()
          }
        },
        { type: ACTIONS.SUPP_APP_LOAD_COMPLETE, data: { statusModal: { loading: false } } }
      ])
    })
  })
})
