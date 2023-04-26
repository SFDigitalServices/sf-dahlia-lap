import { updateSavedPreference } from 'components/supplemental_application/actions/preferenceActionCreators'
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
          { type: ACTIONS.SUPP_APP_LOAD_START },
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
          {
            type: ACTIONS.PREF_TABLE_ROW_CLOSED,
            data: { rowIndex: 0 }
          },
          {
            type: ACTIONS.CONFIRMED_PREFERENCES_FAILED,
            data: { failed: false }
          },
          { type: ACTIONS.SUPP_APP_LOAD_COMPLETE }
        ])
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
})
