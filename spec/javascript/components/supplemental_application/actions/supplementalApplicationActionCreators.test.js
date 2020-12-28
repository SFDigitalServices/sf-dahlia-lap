import {
  loadSupplementalPageData,
  updateSupplementalApplication,
  updateSavedPreference
} from 'components/supplemental_application/actions/supplementalApplicationActionCreators'
import LEASE_STATES from 'components/supplemental_application/utils/leaseSectionStates'
// Lint complains that there's no default export in this file, but it's mocked by jest so it's fine
// eslint-disable-next-line import/default
import mockedRequestUtils from 'components/supplemental_application/utils/supplementalRequestUtils'
import ACTIONS from 'context/actions'

jest.mock(
  'components/supplemental_application/utils/supplementalRequestUtils',
  () => require('../mocks/mockSupplementalRequestUtils').default
)
const MOCK_DISPATCH = jest.fn()

const getFiredActions = (dispatchMock) => dispatchMock.mock.calls.map((call) => call[0])

describe('supplementalApplicationActionCreators', () => {
  describe('loadSupplementalPageData', () => {
    const getExpectedData = (expectedApplication, expectedLeaseSectionState) => ({
      breadcrumbData: {
        listing: {
          buildingAddress: undefined,
          id: 'listingId',
          name: undefined
        },
        application: {
          applicantFullName: undefined,
          id: 'updatedApplicationId',
          number: undefined
        }
      },
      pageData: {
        application: expectedApplication,
        fileBaseUrl: 'fileBaseUrl',
        leaseSectionState: expectedLeaseSectionState,
        listing: {
          id: 'listingId'
        },
        statusHistory: [],
        listingAmiCharts: [],
        rentalAssistances: undefined,
        units: []
      }
    })

    describe('with no lease', () => {
      let firedActions = []
      beforeEach(async () => {
        await loadSupplementalPageData(MOCK_DISPATCH, 'applicationId')
        firedActions = getFiredActions(MOCK_DISPATCH)
      })

      test('should fire the correct actions', () => {
        expect(firedActions).toEqual([
          { type: ACTIONS.SUPP_APP_LOAD_START, data: null },
          {
            type: ACTIONS.SUPP_APP_INITIAL_LOAD_SUCCESS,
            data: getExpectedData({ id: 'updatedApplicationId' }, LEASE_STATES.NO_LEASE)
          },
          { type: ACTIONS.SUPP_APP_LOAD_COMPLETE, data: null }
        ])
      })
    })

    describe('when a lease is returned', () => {
      let firedActions = []
      beforeEach(async () => {
        mockedRequestUtils.getSupplementalPageData.mockResolvedValueOnce({
          application: { id: 'updatedApplicationId', lease: { id: 'leaseId' } },
          statusHistory: [],
          fileBaseUrl: 'fileBaseUrl',
          units: [],
          listing: { id: 'listingId' }
        })
        await loadSupplementalPageData(MOCK_DISPATCH, 'applicationId')
        firedActions = getFiredActions(MOCK_DISPATCH)
      })

      test('should fire the correct actions', () => {
        expect(firedActions).toEqual([
          { type: ACTIONS.SUPP_APP_LOAD_START, data: null },
          {
            type: ACTIONS.SUPP_APP_INITIAL_LOAD_SUCCESS,
            data: getExpectedData(
              { id: 'updatedApplicationId', lease: { id: 'leaseId' } },
              LEASE_STATES.SHOW_LEASE
            )
          },
          { type: ACTIONS.SUPP_APP_LOAD_COMPLETE, data: null }
        ])
      })
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
          data: {
            application: { id: 'applicationId' },
            leaseSectionState: LEASE_STATES.NO_LEASE
          },
          type: 'SUPP_APP_LOAD_SUCCESS'
        },
        { type: ACTIONS.SUPP_APP_LOAD_COMPLETE, data: null }
      ])
    })
  })

  describe('updateSavedPreference', () => {
    describe('when all requests succeed', () => {
      let firedActions = []
      beforeEach(async () => {
        mockedRequestUtils.updatePreference.mockResolvedValue(Promise.resolve(true))
        await updateSavedPreference(MOCK_DISPATCH, 0, {
          id: 'applicationId',
          total_monthly_rent: '10',
          preferences: [
            {
              id: 'preferenceId'
            }
          ]
        })
        firedActions = getFiredActions(MOCK_DISPATCH)
      })

      test('should fire the correct actions', () => {
        expect(firedActions).toEqual([
          { type: ACTIONS.SUPP_APP_LOAD_START, data: null },
          {
            type: ACTIONS.SUPP_APP_LOAD_SUCCESS,
            data: {
              application: {
                id: 'applicationId',
                preferences: [
                  {
                    id: 'preferenceId'
                  }
                ],
                total_monthly_rent: '10'
              },
              confirmedPreferencesFailed: false
            }
          },
          { type: ACTIONS.SUPP_APP_LOAD_COMPLETE, data: null }
        ])
      })
    })
  })

  describe('when all requests fail', () => {
    let firedActions = []
    beforeEach(async () => {
      mockedRequestUtils.updatePreference.mockResolvedValue(Promise.reject(Error('testError')))
      await updateSavedPreference(MOCK_DISPATCH, 0, {
        id: 'applicationId',
        total_monthly_rent: '10',
        preferences: [
          {
            id: 'preferenceId'
          }
        ]
      })
      firedActions = getFiredActions(MOCK_DISPATCH)
    })

    test('should fire the correct actions', () => {
      expect(firedActions).toEqual([
        { type: ACTIONS.SUPP_APP_LOAD_START },
        {
          type: ACTIONS.CONFIRMED_PREFERENCES_FAILED,
          data: {
            failed: true
          }
        },
        { type: ACTIONS.SUPP_APP_LOAD_COMPLETE }
      ])
    })
  })
})
