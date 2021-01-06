import { applicationPageLoadComplete } from 'components/applications/actions/applicationActionCreators'
import ACTIONS from 'context/actions'

const MOCK_DISPATCH = jest.fn()

const firedAction = (dispatchMock) => dispatchMock.mock.calls[0][0]

const getMockApplication = () => ({
  id: 'applicationId',
  listing: {
    id: 'listingId'
  }
})

describe('applicationPageLoadComplete', () => {
  describe('when updateBreadcrumbs is false', () => {
    test('fires an action without breadcrumbdata', () => {
      applicationPageLoadComplete(MOCK_DISPATCH, getMockApplication(), 'fileBaseUrl', false)
      expect(firedAction(MOCK_DISPATCH).type).toEqual(ACTIONS.SHORTFORM_LOADED)
      expect(firedAction(MOCK_DISPATCH).data).toEqual({
        pageData: {
          application: getMockApplication(),
          listing: getMockApplication().listing,
          fileBaseUrl: 'fileBaseUrl'
        }
      })
    })
  })

  describe('when updateBreadcrumbs is true', () => {
    test('fires an action without breadcrumbdata', () => {
      applicationPageLoadComplete(MOCK_DISPATCH, getMockApplication(), 'fileBaseUrl', true)
      expect(firedAction(MOCK_DISPATCH).type).toEqual(ACTIONS.SHORTFORM_LOADED)
      expect(firedAction(MOCK_DISPATCH).data).toEqual({
        breadcrumbData: {
          application: {
            applicantFullName: undefined,
            id: 'applicationId',
            number: undefined
          },
          listing: {
            buildingAddress: undefined,
            id: 'listingId',
            name: undefined
          }
        },
        pageData: {
          application: getMockApplication(),
          listing: getMockApplication().listing,
          fileBaseUrl: 'fileBaseUrl'
        }
      })
    })
  })
})
