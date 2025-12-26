import apiService from 'apiService'
import { useSupplementalPageData } from 'query/hooks/useSupplementalPageData'
import { queryKeys } from 'query/queryKeys'

import { renderHookWithQuery, waitFor } from '../../testUtils/queryTestUtils'

jest.mock('apiService')
jest.mock('components/supplemental_application/actions/supplementalActionUtils', () => ({
  setApplicationDefaults: jest.fn((app) => app)
}))
jest.mock('components/supplemental_application/utils/leaseSectionStates', () => ({
  getInitialLeaseState: jest.fn(() => ({ isEditing: false }))
}))

describe('useSupplementalPageData', () => {
  const mockApplicationId = 'app-123'
  const mockListingId = 'listing-456'

  const mockApplication = {
    id: mockApplicationId,
    name: 'Test Application',
    listing: { id: mockListingId },
    lease: { id: 'lease-1' },
    rental_assistances: [{ id: 'ra-1' }]
  }

  const mockListing = {
    id: mockListingId,
    name: 'Test Listing',
    building_name: 'Test Building'
  }

  const mockUnits = [
    { id: 'unit-1', unit_number: '101', ami_chart_type: 'HUD', ami_chart_year: 2024 },
    { id: 'unit-2', unit_number: '102', ami_chart_type: 'HUD', ami_chart_year: 2024 }
  ]

  const mockLease = { id: 'lease-1', unit_id: 'unit-1' }
  const mockRentalAssistances = [{ id: 'ra-1', type: 'Section 8' }]
  const mockStatusHistory = [{ id: 'status-1', status: 'Approved' }]
  const mockFileBaseUrl = 'https://example.com/files'

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mocks
    apiService.getSupplementalApplication.mockResolvedValue({
      application: mockApplication,
      fileBaseUrl: mockFileBaseUrl
    })
    apiService.getLeaseUpListing.mockResolvedValue(mockListing)
    apiService.getUnits.mockResolvedValue(mockUnits)
    apiService.getLease.mockResolvedValue(mockLease)
    apiService.getRentalAssistances.mockResolvedValue(mockRentalAssistances)
    apiService.getStatusHistory.mockResolvedValue({ statusHistory: mockStatusHistory })
  })

  describe('data fetching', () => {
    test('fetches all required data on success', async () => {
      const { result } = renderHookWithQuery(() =>
        useSupplementalPageData(mockApplicationId, mockListingId)
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(apiService.getSupplementalApplication).toHaveBeenCalledWith(mockApplicationId)
      expect(apiService.getLeaseUpListing).toHaveBeenCalledWith(mockListingId)
      expect(apiService.getUnits).toHaveBeenCalledWith(mockListingId)
      expect(apiService.getLease).toHaveBeenCalledWith(mockApplicationId)
      expect(apiService.getRentalAssistances).toHaveBeenCalledWith(mockApplicationId)
      expect(apiService.getStatusHistory).toHaveBeenCalledWith(mockApplicationId)
    })

    test('returns transformed page data', async () => {
      const { result } = renderHookWithQuery(() =>
        useSupplementalPageData(mockApplicationId, mockListingId)
      )

      await waitFor(() => expect(result.current.pageData).not.toBeNull())

      expect(result.current.application).toBeDefined()
      expect(result.current.listing).toEqual(mockListing)
      expect(result.current.units).toEqual(mockUnits)
      expect(result.current.fileBaseUrl).toBe(mockFileBaseUrl)
      expect(result.current.statusHistory).toEqual(mockStatusHistory)
    })
  })

  describe('application-level data caching', () => {
    test('application data uses application-keyed query', async () => {
      const { result, queryClient } = renderHookWithQuery(() =>
        useSupplementalPageData(mockApplicationId, mockListingId)
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      const applicationQueryKey = queryKeys.supplementalApplications.detail(mockApplicationId)
      const cachedData = queryClient.getQueryData(applicationQueryKey)

      expect(cachedData).toBeDefined()
      expect(cachedData.application.id).toBe(mockApplicationId)
    })
  })

  describe('loading states', () => {
    test('isLoading is true when query is loading', () => {
      const { result } = renderHookWithQuery(() =>
        useSupplementalPageData(mockApplicationId, mockListingId)
      )

      expect(result.current.isLoading).toBe(true)
    })

    test('isLoading is false when query completes', async () => {
      const { result } = renderHookWithQuery(() =>
        useSupplementalPageData(mockApplicationId, mockListingId)
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('error handling', () => {
    test('isError is true when query fails', async () => {
      apiService.getSupplementalApplication.mockRejectedValue(new Error('API Error'))

      const { result } = renderHookWithQuery(() =>
        useSupplementalPageData(mockApplicationId, mockListingId)
      )

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBeDefined()
    })
  })

  describe('when applicationId is undefined', () => {
    test('hook is disabled and does not fetch', async () => {
      const { result } = renderHookWithQuery(() =>
        useSupplementalPageData(undefined, mockListingId)
      )

      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(result.current.isLoading).toBe(false)
      expect(apiService.getSupplementalApplication).not.toHaveBeenCalled()
    })
  })
})
