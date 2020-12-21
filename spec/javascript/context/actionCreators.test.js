import {
  applicationsTablePageChanged,
  listingRowClicked,
  applicationsPageMounted,
  applicationRowClicked,
  applicationsPageLoadComplete,
  listingsPageMounted,
  applicationsTableFiltersApplied
} from 'context/actionCreators/actionCreators'
import ACTIONS from 'context/actions'

const mockDispatch = jest.fn()

const mockApplication = {
  id: 'mockId1',
  name: 'APP 1',
  applicant: {
    first_name: 'firstName1',
    last_name: 'lastName1'
  }
}

const mockFormattedApplication = {
  id: mockApplication.id,
  number: mockApplication.name,
  applicantFullName: `${mockApplication.applicant.first_name} ${mockApplication.applicant.last_name}`
}

const mockListingWithoutAddress = {
  id: 'listingId1',
  name: 'listingName1'
}

const mockListing = {
  ...mockListingWithoutAddress,
  building_street_address: 'listingAddress1'
}

const mockFormattedListingWithoutAddress = {
  id: mockListing.id,
  name: mockListing.name,
  buildingAddress: undefined
}

const mockFormattedListing = {
  ...mockFormattedListingWithoutAddress,
  buildingAddress: mockListing.building_street_address
}

describe('leaseUpActionCreators', () => {
  const getDispatchedAction = () => mockDispatch.mock.calls[0][0]

  describe('applicationsPageMounted', () => {
    test('dispatches correct action', () => {
      applicationsPageMounted(mockDispatch)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTIONS.LEFT_APPLICATION_SCOPE)
      expect(dispatchedAction.data).toBeUndefined()
    })
  })

  describe('listingsPageMounted', () => {
    test('dispatches correct action', () => {
      listingsPageMounted(mockDispatch)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTIONS.LEFT_LISTING_SCOPE)
      expect(dispatchedAction.data).toBeUndefined()
    })
  })

  describe('applicationsPageLoadComplete', () => {
    test('dispatches correct action', () => {
      applicationsPageLoadComplete(mockDispatch, mockListing)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTIONS.SELECTED_LISTING_CHANGED)
      expect(dispatchedAction.data).toEqual(mockFormattedListing)
    })

    test('dispatches correct action with null input', () => {
      applicationsPageLoadComplete(mockDispatch, null)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTIONS.SELECTED_LISTING_CHANGED)
      expect(dispatchedAction.data).toEqual({
        id: undefined,
        name: undefined,
        buildingAddress: undefined
      })
    })
  })

  describe('listingRowClicked', () => {
    test('dispatches correct action', () => {
      listingRowClicked(mockDispatch, mockListingWithoutAddress)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTIONS.SELECTED_LISTING_CHANGED)
      expect(dispatchedAction.data).toEqual(mockFormattedListingWithoutAddress)
    })

    test('dispatches correct action with null input', () => {
      listingRowClicked(mockDispatch, null)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTIONS.SELECTED_LISTING_CHANGED)
      expect(dispatchedAction.data).toEqual({
        id: undefined,
        name: undefined,
        buildingAddress: undefined
      })
    })
  })

  describe('applicationRowClicked', () => {
    test('dispatches correct action', () => {
      const mockApplicationFromApplicationsPage = {
        application_id: mockApplication.id,
        application_number: mockApplication.name,
        first_name: mockApplication.applicant.first_name,
        last_name: mockApplication.applicant.last_name
      }

      applicationRowClicked(mockDispatch, mockApplicationFromApplicationsPage)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTIONS.SELECTED_APPLICATION_CHANGED)
      expect(dispatchedAction.data).toEqual(mockFormattedApplication)
    })

    test('dispatches correct action with null input', () => {
      applicationRowClicked(mockDispatch, null)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTIONS.SELECTED_APPLICATION_CHANGED)
      expect(dispatchedAction.data).toEqual({
        id: undefined,
        number: undefined,
        applicantFullName: undefined
      })
    })
  })

  describe('applicationsTableFiltersApplied', () => {
    test('dispatches correct action', () => {
      const mockFilters = {
        preferences: ['pref1']
      }

      applicationsTableFiltersApplied(mockDispatch, mockFilters)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTIONS.APPLICATION_TABLE_FILTERS_APPLIED)
      expect(dispatchedAction.data).toEqual(mockFilters)
    })

    test('dispatches correct action with null input', () => {
      applicationsTableFiltersApplied(mockDispatch, null)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTIONS.APPLICATION_TABLE_FILTERS_APPLIED)
      expect(dispatchedAction.data).toEqual({})
    })
  })

  describe('applicationsTablePageChanged', () => {
    test('dispatches correct action', () => {
      applicationsTablePageChanged(mockDispatch, 3)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTIONS.APPLICATION_TABLE_PAGE_CHANGED)
      expect(dispatchedAction.data).toEqual(3)
    })

    test('dispatches correct action with null input', () => {
      applicationsTablePageChanged(mockDispatch, null)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTIONS.APPLICATION_TABLE_PAGE_CHANGED)
      expect(dispatchedAction.data).toEqual(0)
    })
  })
})
