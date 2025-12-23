import apiService from 'apiService'
import { useSupplementalApplication } from 'query/hooks/useSupplementalApplication'
import { queryKeys } from 'query/queryKeys'

import { renderHookWithQuery, waitFor } from '../../testUtils/queryTestUtils'

jest.mock('apiService')

describe('useSupplementalApplication', () => {
  const mockApplicationId = 'app-123'
  const mockApplicationData = {
    application: {
      id: mockApplicationId,
      name: 'Test Applicant',
      status: 'Processing',
      preferences: []
    },
    fileBaseUrl: 'https://example.com/files'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when applicationId is provided', () => {
    beforeEach(() => {
      apiService.getSupplementalApplication.mockResolvedValue(mockApplicationData)
    })

    test('returns application and fileBaseUrl on success', async () => {
      const { result } = renderHookWithQuery(() => useSupplementalApplication(mockApplicationId))

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.application).toEqual(mockApplicationData.application)
      expect(result.current.fileBaseUrl).toBe(mockApplicationData.fileBaseUrl)
      expect(apiService.getSupplementalApplication).toHaveBeenCalledWith(mockApplicationId)
      expect(apiService.getSupplementalApplication).toHaveBeenCalledTimes(1)
    })

    test('returns full query data in data property', async () => {
      const { result } = renderHookWithQuery(() => useSupplementalApplication(mockApplicationId))

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockApplicationData)
    })

    test('uses correct query key', async () => {
      const { result, queryClient } = renderHookWithQuery(() =>
        useSupplementalApplication(mockApplicationId)
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const expectedQueryKey = queryKeys.supplementalApplications.detail(mockApplicationId)
      const cachedData = queryClient.getQueryData(expectedQueryKey)

      expect(cachedData).toEqual(mockApplicationData)
    })

    test('returns loading state initially', () => {
      const { result } = renderHookWithQuery(() => useSupplementalApplication(mockApplicationId))

      expect(result.current.isLoading).toBe(true)
      expect(result.current.application).toBeUndefined()
      expect(result.current.fileBaseUrl).toBeUndefined()
    })
  })

  describe('when applicationId is undefined', () => {
    test('hook is disabled and does not fetch', async () => {
      const { result } = renderHookWithQuery(() => useSupplementalApplication(undefined))

      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(result.current.isLoading).toBe(false)
      expect(result.current.fetchStatus).toBe('idle')
      expect(apiService.getSupplementalApplication).not.toHaveBeenCalled()
    })

    test('hook is disabled when applicationId is null', async () => {
      const { result } = renderHookWithQuery(() => useSupplementalApplication(null))

      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(result.current.fetchStatus).toBe('idle')
      expect(apiService.getSupplementalApplication).not.toHaveBeenCalled()
    })

    test('hook is disabled when applicationId is empty string', async () => {
      const { result } = renderHookWithQuery(() => useSupplementalApplication(''))

      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(result.current.fetchStatus).toBe('idle')
      expect(apiService.getSupplementalApplication).not.toHaveBeenCalled()
    })
  })

  describe('when API call fails', () => {
    const mockError = new Error('API Error')

    beforeEach(() => {
      apiService.getSupplementalApplication.mockRejectedValue(mockError)
    })

    test('returns error state', async () => {
      const { result } = renderHookWithQuery(() => useSupplementalApplication(mockApplicationId))

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBe(mockError)
      expect(result.current.application).toBeUndefined()
      expect(result.current.fileBaseUrl).toBeUndefined()
    })
  })

  describe('derived properties', () => {
    test('application is undefined when data is not loaded', () => {
      apiService.getSupplementalApplication.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      )

      const { result } = renderHookWithQuery(() => useSupplementalApplication(mockApplicationId))

      expect(result.current.application).toBeUndefined()
    })

    test('fileBaseUrl is undefined when data is not loaded', () => {
      apiService.getSupplementalApplication.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      )

      const { result } = renderHookWithQuery(() => useSupplementalApplication(mockApplicationId))

      expect(result.current.fileBaseUrl).toBeUndefined()
    })
  })
})
