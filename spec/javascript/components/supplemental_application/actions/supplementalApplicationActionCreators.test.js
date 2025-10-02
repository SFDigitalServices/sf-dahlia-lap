import {
  loadSupplementalPageData,
  updateSupplementalApplication
} from 'components/supplemental_application/actions/supplementalApplicationActionCreators'
import LEASE_STATES from 'components/supplemental_application/utils/leaseSectionStates'
import ACTIONS from 'context/actions'

jest.mock(
  'components/supplemental_application/utils/supplementalRequestUtils',
  () => require('../mocks/mockSupplementalRequestUtils').default
)
const MOCK_DISPATCH = jest.fn()

const getFiredActions = (dispatchMock) => dispatchMock.mock.calls.map((call) => call[0])

describe('supplementalApplicationActionCreators', () => {
  describe('loadSupplementalPageData', () => {
    beforeEach(() => {
      MOCK_DISPATCH.mockClear()
    })

    const buildBaseData = (application = { id: 'updatedApplicationId' }) => ({
      application,
      statusHistory: [],
      fileBaseUrl: 'fileBaseUrl',
      units: [],
      listing: { id: 'listingId' }
    })

    test('dispatches initial load success without lease', () => {
      loadSupplementalPageData(MOCK_DISPATCH, buildBaseData())

      expect(MOCK_DISPATCH).toHaveBeenCalledTimes(1)
      const [action] = getFiredActions(MOCK_DISPATCH)
      expect(action.type).toBe(ACTIONS.SUPP_APP_INITIAL_LOAD_SUCCESS)
      expect(action.data.pageData.application.id).toBe('updatedApplicationId')
      expect(action.data.pageData.leaseSectionState).toBe(LEASE_STATES.NO_LEASE)
      expect(action.data.pageData.statusHistory).toEqual([])
      expect(action.data.pageData.units).toEqual([])
    })

    test('derives lease section state when lease is present', () => {
      loadSupplementalPageData(
        MOCK_DISPATCH,
        buildBaseData({ id: 'updatedApplicationId', lease: { id: 'leaseId' } })
      )

      expect(MOCK_DISPATCH).toHaveBeenCalledTimes(1)
      const [action] = getFiredActions(MOCK_DISPATCH)
      expect(action.data.pageData.leaseSectionState).toBe(LEASE_STATES.SHOW_LEASE)
      expect(action.data.pageData.application.lease).toEqual({ id: 'leaseId' })
    })
  })

  describe('updateSupplementalApplication', () => {
    let firedActions = []
    beforeEach(async () => {
      await updateSupplementalApplication(MOCK_DISPATCH, LEASE_STATES.NO_LEASE, {}, {})
      firedActions = getFiredActions(MOCK_DISPATCH)
    })

    test('should fire the correct actions', () => {
      expect(firedActions).toEqual([
        { type: ACTIONS.SUPP_APP_LOAD_START, data: null },
        {
          type: ACTIONS.SUPP_APP_LOAD_SUCCESS,
          data: {
            application: { id: 'applicationId' },
            assistanceRowsOpened: new Set(),
            confirmedPreferencesFailed: false,
            leaseSectionState: LEASE_STATES.NO_LEASE,
            preferenceRowsOpened: new Set()
          }
        },
        { type: ACTIONS.SUPP_APP_LOAD_COMPLETE, data: null }
      ])
    })
  })
})
