import { cleanup } from '@testing-library/react'
import { useFlag as useFlagUnleash, useFlagsStatus, useVariant } from '@unleash/proxy-client-react'

import { IsOneUrlPerAppEnabledForListing } from 'utils/inviteApplyEmail'

jest.mock('@unleash/proxy-client-react')

describe('IsOneUrlPerAppEnabledForListing', () => {
  beforeEach(async () => {
    useFlagsStatus.mockImplementation(() => ({
      flagsError: false,
      flagsReady: true
    }))
  })
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  describe('Flag is on', () => {
    beforeEach(async () => {
      useFlagUnleash.mockImplementation(() => true)

      useVariant.mockImplementation(() => {
        return {
          payload: {
            value: '{\n  "enabled_listings": [\n    "listingId"\n  ]\n}'
          }
        }
      })
    })

    test('listingId is in the variant', async () => {
      expect(IsOneUrlPerAppEnabledForListing('listingId')).toBe(true)
    })

    test('listingId is not the variant', async () => {
      expect(IsOneUrlPerAppEnabledForListing('foo')).toBe(false)
    })

    test('variant payload is undefined', async () => {
      useVariant.mockImplementation(() => {
        return {
          payload: undefined
        }
      })
      expect(IsOneUrlPerAppEnabledForListing('listingId')).toBe(false)
    })
  })
  describe('Flag is off', () => {
    beforeEach(async () => {
      useFlagUnleash.mockImplementation(() => false)
    })

    test('function returns false', async () => {
      expect(IsOneUrlPerAppEnabledForListing('listingId')).toBe(false)
    })
  })
})
