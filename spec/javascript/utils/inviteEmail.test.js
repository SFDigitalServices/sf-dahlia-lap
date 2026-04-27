import {
  IsInviteToApplyEnabledForListing,
  IsI2IEnabledForListing,
  I2A_OUTREACH_VALUE,
  I2I_OUTREACH_VALUE
} from 'utils/inviteEmail'

const mockI2IListing = {
  id: 123,
  leaseup_outreach: I2I_OUTREACH_VALUE
}
const mockI2AListing = {
  id: 789,
  leaseup_outreach: I2A_OUTREACH_VALUE
}
const variant = {
  payload: {
    value: JSON.stringify({ enabled_listings: [123, 456] })
  }
}

describe('IsInviteToApplyEnabledForListing', () => {
  describe('when feature flag is enabled', () => {
    const i2aFlag = true

    it('returns true for listings with i2a outreach', () => {
      expect(IsInviteToApplyEnabledForListing(mockI2AListing, i2aFlag)).toBe(true)
    })

    it('returns false for listings without i2a outreach', () => {
      expect(IsInviteToApplyEnabledForListing(mockI2IListing, i2aFlag)).toBe(false)
    })

    it('returns false for missing listing', () => {
      expect(IsInviteToApplyEnabledForListing(null, i2aFlag)).toBeFalsy()
    })
  })

  describe('when feature flag is disabled', () => {
    const i2aFlag = false

    it('returns false even when listing has i2a outreach', () => {
      expect(IsInviteToApplyEnabledForListing(mockI2AListing, i2aFlag)).toBe(false)
    })

    it('returns false for listings without i2a outreach', () => {
      expect(IsInviteToApplyEnabledForListing(mockI2IListing, i2aFlag)).toBe(false)
    })

    it('returns false for missing listing', () => {
      expect(IsInviteToApplyEnabledForListing(null, i2aFlag)).toBe(false)
    })
  })
})

describe('IsI2IEnabledForListing', () => {
  describe('when feature flag is enabled', () => {
    const i2iFlag = true

    it('returns true for listings with i2i outreach', () => {
      expect(IsI2IEnabledForListing(mockI2IListing, i2iFlag, variant)).toBe(true)
    })

    it('returns false for listings without i2i outreach', () => {
      expect(IsI2IEnabledForListing(mockI2AListing, i2iFlag, variant)).toBe(false)
    })
  })

  describe('when feature flag is disabled', () => {
    const i2iFlag = false

    it('returns false regardless of listing id', () => {
      expect(IsI2IEnabledForListing(mockI2IListing, i2iFlag, variant)).toBe(false)
      expect(IsI2IEnabledForListing(mockI2AListing, i2iFlag, variant)).toBe(false)
    })
  })

  describe('when variant payload is undefined', () => {
    const i2iFlag = true
    const variant = {
      payload: undefined
    }

    it('still returns true for listings with i2i outreach', () => {
      expect(IsI2IEnabledForListing(mockI2IListing, i2iFlag, variant)).toBe(true)
    })
  })

  describe('when variant payload is malformed', () => {
    const i2iFlag = true

    it('still returns true when payload.value is missing', () => {
      const variant = {
        payload: {}
      }

      expect(() => IsI2IEnabledForListing(mockI2IListing, i2iFlag, variant)).not.toThrow()
      expect(IsI2IEnabledForListing(mockI2IListing, i2iFlag, variant)).toBe(true)
    })

    it('still returns true when payload.value is invalid JSON', () => {
      const variant = {
        payload: {
          value: '{invalid-json'
        }
      }

      expect(() => IsI2IEnabledForListing(mockI2IListing, i2iFlag, variant)).not.toThrow()
      expect(IsI2IEnabledForListing(mockI2IListing, i2iFlag, variant)).toBe(true)
    })

    it('still returns true when payload JSON does not contain enabled_listings', () => {
      const variant = {
        payload: {
          value: JSON.stringify({ some_other_key: [123, 456] })
        }
      }

      expect(() => IsI2IEnabledForListing(mockI2IListing, i2iFlag, variant)).not.toThrow()
      expect(IsI2IEnabledForListing(mockI2IListing, i2iFlag, variant)).toBe(true)
    })
  })
})
