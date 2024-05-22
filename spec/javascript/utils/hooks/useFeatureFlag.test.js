import { renderHook } from '@testing-library/react'
import { useFlag as useFlagUnleash, useFlagsStatus } from '@unleash/proxy-client-react'

import { useFeatureFlag } from '../../../../app/javascript/utils/hooks/useFeatureFlag'

jest.mock('@unleash/proxy-client-react')

describe('useFeatureFlag', () => {
  let consoleSpy

  beforeEach(() => {
    process.env.UNLEASH_ENV = 'development'
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('returns the default value when the flag is not set', () => {
    useFlagUnleash.mockImplementation(() => undefined)
    useFlagsStatus.mockImplementation(() => ({
      flagsError: null
    }))

    const { result } = renderHook(() => useFeatureFlag('testFlag', false))
    expect(consoleSpy).toHaveBeenCalled()
    expect(result.current).toBe(false)
  })

  it('returns the default value when there is a flagError', () => {
    useFlagUnleash.mockImplementation(() => undefined)
    useFlagsStatus.mockImplementation(() => ({
      flagsError: true
    }))

    const { result } = renderHook(() => useFeatureFlag('testFlag', false))

    expect(consoleSpy).toHaveBeenCalled()
    expect(result.current).toBe(false)
  })

  it('returns the actual Unleash value when there is no URL flag or loading errors', () => {
    useFlagUnleash.mockImplementation(() => true)
    useFlagsStatus.mockImplementation(() => ({
      flagsError: false
    }))

    const { result } = renderHook(() => useFeatureFlag('testFlag', false))

    expect(consoleSpy).not.toHaveBeenCalled()
    expect(result.current).toBe(true)
  })

  it('returns true when the url override is set to true', () => {
    useFlagUnleash.mockImplementation(() => false)
    useFlagsStatus.mockImplementation(() => ({
      flagsError: false
    }))

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search: '?featureFlag[testFlag]=true' }
    })

    const { result } = renderHook(() => useFeatureFlag('testFlag', false))

    expect(consoleSpy).not.toHaveBeenCalled()
    expect(result.current).toBe(true)
  })

  it('returns false when the url override is set to false', () => {
    useFlagUnleash.mockImplementation(() => true)
    useFlagsStatus.mockImplementation(() => ({
      flagsError: false
    }))

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search: '?featureFlag[testFlag]=false' }
    })

    const { result } = renderHook(() => useFeatureFlag('testFlag', true))

    expect(consoleSpy).not.toHaveBeenCalled()
    expect(result.current).toBe(false)
  })

  it('returns the unleash flag when the url override is set to something random', () => {
    useFlagUnleash.mockImplementation(() => true)
    useFlagsStatus.mockImplementation(() => ({
      flagsError: false
    }))

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search: '?featureFlag[testFlag]=blablabla' }
    })

    const { result } = renderHook(() => useFeatureFlag('testFlag', false))

    expect(consoleSpy).not.toHaveBeenCalled()
    expect(result.current).toBe(true)
  })

  it('returns the default flag when the url override is set to something random and there is no unleash flag available', () => {
    useFlagUnleash.mockImplementation(() => null)
    useFlagsStatus.mockImplementation(() => ({
      flagsError: true
    }))

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search: '?featureFlag[testFlag]=blablabla' }
    })
    jest.spyOn(require('@unleash/proxy-client-react'), 'useFlagsStatus').mockImplementation(() => {
      return { flagsError: true }
    })
    jest.spyOn(require('@unleash/proxy-client-react'), 'useFlag').mockImplementation(() => {
      return undefined
    })

    const { result } = renderHook(() => useFeatureFlag('testFlag', false))

    expect(consoleSpy).toHaveBeenCalled()
    expect(result.current).toBe(false)
  })
})
