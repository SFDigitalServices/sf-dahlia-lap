import { IsInviteToApplyEnabledForListing } from 'utils/inviteApplyEmail'

describe('IsInviteToApplyEnabledForListing', () => {
  const mockListing = {
    program_type: 'IH-RENTAL',
    listing_type: 'Lottery'
  }

  const mockFcfsListing = {
    program_type: 'IH-RENTAL',
    listing_type: 'First Come, First Served'
  }

  const mockNonIhRentalListing = {
    program_type: 'SOME-OTHER-TYPE',
    listing_type: 'Lottery'
  }

  describe('when feature flag is enabled', () => {
    const i2aFlag = true

    it('returns true for IH-RENTAL listings that are not First Come, First Served', () => {
      expect(IsInviteToApplyEnabledForListing(mockListing, i2aFlag)).toBe(true)
    })

    it('returns false for IH-RENTAL listings that are First Come, First Served', () => {
      expect(IsInviteToApplyEnabledForListing(mockFcfsListing, i2aFlag)).toBe(false)
    })

    it('returns false for non-IH-RENTAL listings', () => {
      expect(IsInviteToApplyEnabledForListing(mockNonIhRentalListing, i2aFlag)).toBe(false)
    })
  })

  describe('when feature flag is disabled', () => {
    const i2aFlag = false

    it('returns false for IH-RENTAL listings that are not First Come, First Served', () => {
      expect(IsInviteToApplyEnabledForListing(mockListing, i2aFlag)).toBe(false)
    })

    it('returns false for IH-RENTAL listings that are First Come, First Served', () => {
      expect(IsInviteToApplyEnabledForListing(mockFcfsListing, i2aFlag)).toBe(false)
    })

    it('returns false for non-IH-RENTAL listings', () => {
      expect(IsInviteToApplyEnabledForListing(mockNonIhRentalListing, i2aFlag)).toBe(false)
    })
  })
})
