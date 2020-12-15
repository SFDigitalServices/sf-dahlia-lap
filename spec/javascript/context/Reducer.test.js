import {
  ACTION_TYPE_SUPP_APP_LOADED,
  ACTION_TYPE_SHORTFORM_LOADED,
  ACTION_TYPE_APPLICATION_TABLE_FILTERS_APPLIED,
  ACTION_TYPE_APPLICATION_TABLE_PAGE_CHANGED,
  ACTION_TYPE_LEFT_APPLICATION_SCOPE,
  ACTION_TYPE_LEFT_LISTING_SCOPE,
  ACTION_TYPE_SELECTED_APPLICATION_CHANGED,
  ACTION_TYPE_SELECTED_LISTING_CHANGED
} from 'context/actions'
import Reducer from 'context/Reducer'

const mockState = {
  breadcrumbData: {
    listing: {
      id: 'listingId',
      name: 'listingName',
      buildingAddress: 'listingAddress'
    },
    application: {
      id: 'listingId',
      number: 'listingName',
      applicantFullName: 'jeremy beremy'
    }
  },
  applicationsListData: {
    appliedFilters: {
      preferences: ['pref1']
    },
    page: 1
  },
  applicationDetailsData: {
    shortform: null,
    supplemental: null
  }
}

const mockNewListing = {
  id: 'listingId2',
  name: 'listingName2',
  buildingAddress: 'listingAddress2'
}

const mockNewApplication = {
  id: 'listingId2',
  number: 'listingName2',
  applicantFullName: 'jeremy2 beremy2'
}

const getMockAction = (type, data = null) => ({
  type,
  ...(data && { data })
})

describe('Reducer', () => {
  describe('ACTION_TYPE_SELECTED_LISTING_CHANGED', () => {
    test('should only override the listing data', () => {
      const newState = Reducer(
        mockState,
        getMockAction(ACTION_TYPE_SELECTED_LISTING_CHANGED, mockNewListing)
      )

      expect(newState).toEqual({
        ...mockState,
        breadcrumbData: {
          ...mockState.breadcrumbData,
          listing: mockNewListing
        }
      })
    })

    test('clears out existing address when no address is provided', () => {
      const listingWithoutAddress = {
        id: mockNewListing.id,
        name: mockNewListing.name,
        buildingAddress: null
      }

      const newState = Reducer(
        mockState,
        getMockAction(ACTION_TYPE_SELECTED_LISTING_CHANGED, listingWithoutAddress)
      )

      expect(newState).toEqual({
        ...mockState,
        breadcrumbData: {
          ...mockState.breadcrumbData,
          listing: listingWithoutAddress
        }
      })
    })
  })

  describe('ACTION_TYPE_LEFT_LISTING_SCOPE', () => {
    test('should only delete listing data and applicationsList data', () => {
      const newState = Reducer(mockState, getMockAction(ACTION_TYPE_LEFT_LISTING_SCOPE))

      expect(newState).toEqual({
        ...mockState,
        applicationsListData: {
          appliedFilters: {},
          page: 0
        },
        breadcrumbData: {
          ...mockState.breadcrumbData,
          listing: {
            id: null,
            name: null,
            buildingAddress: null
          }
        }
      })
    })
  })

  describe('ACTION_TYPE_APPLICATION_TABLE_FILTERS_APPLIED', () => {
    test('should reset the page and filtersApplied only', () => {
      const newState = Reducer(
        mockState,
        getMockAction(ACTION_TYPE_APPLICATION_TABLE_FILTERS_APPLIED, { preferences: ['pref2'] })
      )

      expect(newState).toEqual({
        ...mockState,
        applicationsListData: {
          appliedFilters: { preferences: ['pref2'] },
          page: 0
        }
      })
    })
  })

  describe('ACTION_TYPE_APPLICATION_TABLE_PAGE_CHANGED', () => {
    test('should update the page only', () => {
      const newState = Reducer(
        mockState,
        getMockAction(ACTION_TYPE_APPLICATION_TABLE_PAGE_CHANGED, 3)
      )

      expect(newState).toEqual({
        ...mockState,
        applicationsListData: {
          ...mockState.applicationsListData,
          page: 3
        }
      })
    })
  })

  describe('ACTION_TYPE_SELECTED_APPLICATION_CHANGED', () => {
    test('should only update application data', () => {
      const newState = Reducer(
        mockState,
        getMockAction(ACTION_TYPE_SELECTED_APPLICATION_CHANGED, mockNewApplication)
      )

      expect(newState).toEqual({
        ...mockState,
        breadcrumbData: {
          ...mockState.breadcrumbData,
          application: mockNewApplication
        }
      })
    })
  })

  describe('ACTION_TYPE_LEFT_APPLICATION_SCOPE', () => {
    test('should only delete application data', () => {
      const newState = Reducer(mockState, getMockAction(ACTION_TYPE_LEFT_APPLICATION_SCOPE))

      expect(newState).toEqual({
        ...mockState,
        breadcrumbData: {
          ...mockState.breadcrumbData,
          application: {
            id: null,
            number: null,
            applicantFullName: null
          }
        }
      })
    })
  })

  describe('ACTION_TYPE_SUPP_APP_LOADED', () => {
    test('should override listing and application data', () => {
      const newState = Reducer(
        mockState,
        getMockAction(ACTION_TYPE_SUPP_APP_LOADED, {
          application: mockNewApplication,
          listing: mockNewListing
        })
      )

      expect(newState).toEqual({
        ...mockState,
        breadcrumbData: {
          ...mockState.breadcrumbData,
          application: mockNewApplication,
          listing: mockNewListing
        },
        applicationDetailsData: {
          ...mockState.applicationDetailsData,
          supplemental: {
            application: mockNewApplication,
            listing: mockNewListing
          }
        }
      })
    })
  })

  describe('ACTION_TYPE_SHORTFORM_LOADED', () => {
    test('should override listing and application data', () => {
      const newState = Reducer(
        mockState,
        getMockAction(ACTION_TYPE_SHORTFORM_LOADED, {
          application: mockNewApplication,
          listing: mockNewListing
        })
      )

      expect(newState).toEqual({
        ...mockState,
        breadcrumbData: {
          ...mockState.breadcrumbData,
          application: mockNewApplication,
          listing: mockNewListing
        },
        applicationDetailsData: {
          ...mockState.applicationDetailsData,
          shortform: {
            application: mockNewApplication,
            listing: mockNewListing
          }
        }
      })
    })
  })
})
