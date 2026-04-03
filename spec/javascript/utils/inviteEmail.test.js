import { IsInviteToApplyEnabledForListing, IsI2IEnabledForListing } from 'utils/inviteEmail'

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

describe('IsI2IEnabledForListing', () => {
  const mockListing = {
    id: 123
  }
  const otherListing = { id: 789 }
  const variant = {
    payload: {
      value: JSON.stringify({ enabled_listings: [123, 456] })
    }
  }

  describe('when feature flag is enabled and variant has enabled listings', () => {
    const i2iFlag = true

    it('returns true if listing id is in enabled listings', () => {
      expect(IsI2IEnabledForListing(mockListing, i2iFlag, variant)).toBe(true)
    })

    it('returns false if listing id is not in enabled listings', () => {
      expect(IsI2IEnabledForListing(otherListing, i2iFlag, variant)).toBe(false)
    })
  })

  describe('when feature flag is disabled', () => {
    const i2iFlag = false

    it('returns false regardless of listing id', () => {
      expect(IsI2IEnabledForListing(mockListing, i2iFlag, variant)).toBe(false)
      expect(IsI2IEnabledForListing(otherListing, i2iFlag, variant)).toBe(false)
    })
  })

  describe('when variant payload is undefined', () => {
    const i2iFlag = true
    const variant = {
      payload: undefined
    }

    it('returns false', () => {
      expect(IsI2IEnabledForListing(mockListing, i2iFlag, variant)).toBe(false)
    })
  })
})
