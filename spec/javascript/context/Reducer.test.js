import ACTIONS from 'context/actions'
import Reducer from 'context/Reducer'

const mockState = ({
  breadcrumbApplicationOverrides = {},
  breadcrumbListingOverrides = {},
  applicationListOverrides = {},
  supplementalOverrides = {},
  shortformOverrides = {}
} = {}) => ({
  breadcrumbData: {
    listing: {
      id: 'listingId',
      name: 'listingName',
      buildingAddress: 'listingAddress',
      ...breadcrumbListingOverrides
    },
    application: {
      id: 'listingId',
      number: 'listingName',
      applicantFullName: 'jeremy beremy',
      ...breadcrumbApplicationOverrides
    }
  },
  applicationsListData: {
    appliedFilters: {
      preferences: ['pref1']
    },
    page: 1,
    ...applicationListOverrides
  },
  supplementalApplicationData: {
    shortform: {
      application: null,
      fileBaseUrl: null,
      ...shortformOverrides
    },
    supplemental: {
      application: null,
      confirmedPreferencesFailed: false,
      fileBaseUrl: null,
      leaseSectionState: null,
      listing: null,
      listingAmiCharts: null,
      loading: false,
      rentalAssistances: null,
      statusHistory: null,
      statusModal: {
        alertMsg: null,
        isOpen: false,
        loading: false,
        showAlert: false,
        status: null,
        substatus: null,
        isInAddCommentMode: false
      },
      units: null,
      preferenceRowsOpened: new Set(),
      assistanceRowsOpened: new Set(),
      ...supplementalOverrides
    }
  }
})

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

const applyAction = (type, data = null, initialState = mockState()) =>
  Reducer(initialState, getMockAction(type, data))

describe('Reducer', () => {
  describe('ACTIONS.SELECTED_LISTING_CHANGED', () => {
    test('should only override the listing data', () => {
      const newState = applyAction(ACTIONS.SELECTED_LISTING_CHANGED, mockNewListing)

      expect(newState).toEqual(
        mockState({
          breadcrumbListingOverrides: mockNewListing
        })
      )
    })

    test('clears out existing address when no address is provided', () => {
      const listingWithoutAddress = {
        id: mockNewListing.id,
        name: mockNewListing.name,
        buildingAddress: null
      }

      const newState = applyAction(ACTIONS.SELECTED_LISTING_CHANGED, listingWithoutAddress)

      expect(newState).toEqual(
        mockState({
          breadcrumbListingOverrides: listingWithoutAddress
        })
      )
    })
  })

  describe('ACTIONS.LEFT_LISTING_SCOPE', () => {
    test('should only delete listing data and applicationsList data', () => {
      const newState = applyAction(ACTIONS.LEFT_LISTING_SCOPE)

      expect(newState).toEqual(
        mockState({
          applicationListOverrides: {
            appliedFilters: {},
            page: 0
          },
          breadcrumbListingOverrides: {
            id: null,
            name: null,
            buildingAddress: null
          }
        })
      )
    })
  })

  describe('ACTIONS.APPLICATION_TABLE_FILTERS_APPLIED', () => {
    test('should reset the page and filtersApplied only', () => {
      const newState = applyAction(ACTIONS.APPLICATION_TABLE_FILTERS_APPLIED, {
        preferences: ['pref2']
      })

      expect(newState).toEqual({
        ...mockState(),
        applicationsListData: {
          appliedFilters: { preferences: ['pref2'] },
          page: 0
        }
      })
    })
  })

  describe('ACTIONS.APPLICATION_TABLE_PAGE_CHANGED', () => {
    test('should update the page only', () => {
      const newState = applyAction(ACTIONS.APPLICATION_TABLE_PAGE_CHANGED, 3)

      expect(newState).toEqual({
        ...mockState(),
        applicationsListData: {
          ...mockState().applicationsListData,
          page: 3
        }
      })
    })
  })

  describe('ACTIONS.SELECTED_APPLICATION_CHANGED', () => {
    test('should only update application data', () => {
      const newState = applyAction(ACTIONS.SELECTED_APPLICATION_CHANGED, mockNewApplication)

      expect(newState).toEqual({
        ...mockState(),
        breadcrumbData: {
          ...mockState().breadcrumbData,
          application: mockNewApplication
        }
      })
    })
  })

  describe('ACTIONS.LEFT_APPLICATION_SCOPE', () => {
    test('should only delete application data', () => {
      const newState = applyAction(ACTIONS.LEFT_APPLICATION_SCOPE)

      expect(newState).toEqual(
        mockState({
          breadcrumbApplicationOverrides: {
            id: null,
            number: null,
            applicantFullName: null
          }
        })
      )
    })
  })

  describe('ACTIONS.SUPP_APP_INITIAL_LOAD_SUCCESS', () => {
    test('should override listing and application data', () => {
      const newState = applyAction(ACTIONS.SUPP_APP_INITIAL_LOAD_SUCCESS, {
        breadcrumbData: {
          application: mockNewApplication,
          listing: mockNewListing
        }
      })

      expect(newState).toEqual(
        mockState({
          breadcrumbApplicationOverrides: mockNewApplication,
          breadcrumbListingOverrides: mockNewListing
        })
      )
    })
  })

  describe('ACTIONS.SHORTFORM_LOADED', () => {
    test('should override listing and application data', () => {
      const newState = applyAction(ACTIONS.SHORTFORM_LOADED, {
        breadcrumbData: {
          application: mockNewApplication,
          listing: mockNewListing
        },
        pageData: {
          application: { id: 'testShortFormLoadedId' }
        }
      })

      expect(newState).toEqual(
        mockState({
          breadcrumbListingOverrides: mockNewListing,
          breadcrumbApplicationOverrides: mockNewApplication,
          shortformOverrides: { application: { id: 'testShortFormLoadedId' } }
        })
      )
    })
  })

  describe('ACTIONS.CONFIRMED_PREFERENCES_FAILED', () => {
    test('should override confirmedPreferencesFailed', () => {
      const newState = applyAction(ACTIONS.CONFIRMED_PREFERENCES_FAILED, {
        failed: true
      })

      const expectedState = mockState({
        supplementalOverrides: { confirmedPreferencesFailed: true }
      })

      expect(newState).toEqual(expectedState)
    })

    test('should override confirmedPreferencesFailed when false', () => {
      const newState = applyAction(ACTIONS.CONFIRMED_PREFERENCES_FAILED, {
        failed: false
      })

      const expectedState = mockState({
        supplementalOverrides: { confirmedPreferencesFailed: false }
      })

      expect(newState).toEqual(expectedState)
    })
  })

  describe('ACTIONS.SUPP_APP_LOAD_START', () => {
    test('should override loading only when no data provided', () => {
      const newState = applyAction(ACTIONS.SUPP_APP_LOAD_START)

      const expectedState = mockState({
        supplementalOverrides: { loading: true }
      })

      expect(newState).toEqual(expectedState)
    })

    test('should override other data when provided', () => {
      const newState = applyAction(ACTIONS.SUPP_APP_LOAD_START, {
        confirmedPreferencesFailed: true
      })

      const expectedState = mockState({
        supplementalOverrides: { loading: true, confirmedPreferencesFailed: true }
      })

      expect(newState).toEqual(expectedState)
    })
  })

  describe('ACTIONS.SUPP_APP_LOAD_COMPLETE', () => {
    test('should override loading to false only when no data provided and the state has loading=true to start', () => {
      // start with initial state loading = true
      const initialState = mockState({
        supplementalOverrides: { loading: true }
      })

      const newState = applyAction(ACTIONS.SUPP_APP_LOAD_COMPLETE, null, initialState)

      expect(newState).toEqual(
        mockState({
          supplementalOverrides: { loading: false }
        })
      )
    })

    test('should override loading to false only when no data provided and the state has loading=false to start', () => {
      // start with initial state loading = true
      const initialState = mockState({
        supplementalOverrides: { loading: false }
      })

      const newState = applyAction(ACTIONS.SUPP_APP_LOAD_COMPLETE, null, initialState)

      expect(newState).toEqual(
        mockState({
          supplementalOverrides: { loading: false }
        })
      )
    })

    test('should override other data when provided', () => {
      // start with initial state loading = true
      const initialState = mockState({
        supplementalOverrides: { loading: false }
      })

      const newState = applyAction(
        ACTIONS.SUPP_APP_LOAD_COMPLETE,
        {
          confirmedPreferencesFailed: true
        },
        initialState
      )

      const expectedState = mockState({
        supplementalOverrides: { loading: false, confirmedPreferencesFailed: true }
      })

      expect(newState).toEqual(expectedState)
    })
  })

  describe('ACTIONS.SUPP_APP_LOAD_SUCCESS', () => {
    test('should be no-op when no data is passed', () => {
      const newState = applyAction(ACTIONS.SUPP_APP_LOAD_SUCCESS, null)

      expect(newState).toEqual(mockState())
    })

    test('should override whatever data is passed in', () => {
      const newState = applyAction(ACTIONS.SUPP_APP_LOAD_COMPLETE, {
        confirmedPreferencesFailed: true,
        statusHistory: []
      })

      const expectedState = mockState({
        supplementalOverrides: { confirmedPreferencesFailed: true, statusHistory: [] }
      })

      expect(newState).toEqual(expectedState)
    })
  })

  describe('Preference table actions', () => {
    const getStateWithPrefs = (preferenceList) =>
      mockState({
        supplementalOverrides: { preferenceRowsOpened: new Set(preferenceList) }
      })

    describe('ACTIONS.PREF_TABLE_ROW_OPENED', () => {
      test('should add index to empty set', () => {
        const newState = applyAction(ACTIONS.PREF_TABLE_ROW_OPENED, { rowIndex: 0 })
        const expectedState = getStateWithPrefs([0])
        expect(newState).toEqual(expectedState)
      })

      test('should not add duplicate index', () => {
        const newState = applyAction(
          ACTIONS.PREF_TABLE_ROW_OPENED,
          { rowIndex: 0 },
          getStateWithPrefs([0, 1, 2])
        )

        expect(newState).toEqual(getStateWithPrefs([0, 1, 2]))
      })

      test('should add new index to set with 3 indexes', () => {
        const newState = applyAction(
          ACTIONS.PREF_TABLE_ROW_OPENED,
          { rowIndex: 3 },
          getStateWithPrefs([0, 1, 2])
        )

        expect(newState).toEqual(getStateWithPrefs([0, 1, 2, 3]))
      })
    })

    describe('ACTIONS.PREF_TABLE_ROW_CLOSED', () => {
      test('should not do anything when set is empty', () => {
        const newState = applyAction(ACTIONS.PREF_TABLE_ROW_CLOSED, { rowIndex: 0 })
        expect(newState).toEqual(mockState())
      })

      test('should remove the index from the set', () => {
        const stateWithSingleItemOpen = getStateWithPrefs([0])

        const newState = applyAction(
          ACTIONS.PREF_TABLE_ROW_CLOSED,
          { rowIndex: 0 },
          stateWithSingleItemOpen
        )

        expect(newState).toEqual(mockState())
      })

      test('should remove only the selected index from the set', () => {
        const newState = applyAction(
          ACTIONS.PREF_TABLE_ROW_CLOSED,
          { rowIndex: 0 },
          getStateWithPrefs([0, 1, 2])
        )

        expect(newState).toEqual(getStateWithPrefs([1, 2]))
      })
    })
  })

  describe('Assistance table actions', () => {
    const getStateWithAssistanceIds = (assistanceIds) =>
      mockState({
        supplementalOverrides: { assistanceRowsOpened: new Set(assistanceIds) }
      })

    describe('ACTIONS.PREF_TABLE_ROW_OPENED', () => {
      test('should add index to empty set', () => {
        const newState = applyAction(ACTIONS.ASSISTANCE_TABLE_ROW_OPENED, { assistanceId: '0' })
        const expectedState = getStateWithAssistanceIds(['0'])
        expect(newState).toEqual(expectedState)
      })

      test('should not add duplicate index', () => {
        const newState = applyAction(
          ACTIONS.ASSISTANCE_TABLE_ROW_OPENED,
          { assistanceId: '0' },
          getStateWithAssistanceIds(['0', '1', '2'])
        )

        expect(newState).toEqual(getStateWithAssistanceIds(['0', '1', '2']))
      })

      test('should add new index to set with 3 indexes', () => {
        const newState = applyAction(
          ACTIONS.ASSISTANCE_TABLE_ROW_OPENED,
          { assistanceId: '3' },
          getStateWithAssistanceIds(['0', '1', '2'])
        )

        expect(newState).toEqual(getStateWithAssistanceIds(['0', '1', '2', '3']))
      })
    })

    describe('ACTIONS.PREF_TABLE_ROW_CLOSED', () => {
      test('should not do anything when set is empty', () => {
        const newState = applyAction(ACTIONS.ASSISTANCE_TABLE_ROW_CLOSED, { assistanceId: '0' })
        expect(newState).toEqual(mockState())
      })

      test('should remove the index from the set', () => {
        const stateWithSingleItemOpen = getStateWithAssistanceIds(['0'])

        const newState = applyAction(
          ACTIONS.ASSISTANCE_TABLE_ROW_CLOSED,
          { assistanceId: '0' },
          stateWithSingleItemOpen
        )

        expect(newState).toEqual(mockState())
      })

      test('should remove only the selected index from the set', () => {
        const newState = applyAction(
          ACTIONS.ASSISTANCE_TABLE_ROW_CLOSED,
          { assistanceId: '0' },
          getStateWithAssistanceIds(['0', '1', '2'])
        )

        expect(newState).toEqual(getStateWithAssistanceIds(['1', '2']))
      })
    })
  })
})
