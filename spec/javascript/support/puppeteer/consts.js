// Default to Automated Test Listing on Full
export const NON_LEASE_UP_LISTING_ID = process.env.E2E_NON_LEASE_UP_LISTING_ID || 'a0W0P00000F8YG4UAN'

// Default to Yellow Acres on Full
export const LEASE_UP_LISTING_ID = process.env.E2E_LEASE_UP_LISTING_ID || 'a0W0P00000GbyuQ'

// Default to an application from Yellow Acres on Full
export const LEASE_UP_LISTING_APPLICATION_ID = process.env.E2E_LEASE_UP_LISTING_APPLICATION_ID || 'a0o0P00000GZazOQAT'

export const DEFAULT_E2E_TIME_OUT = 60000 // 1 minute

// Default to Sale Test Listing Homeownership Acres on Full
export const SALE_LISTING_ID = process.env.E2E_SALE_LISTING_ID || 'a0W0P00000GlKfBUAV'

// Default to sample flagged record set on full
export const FLAGGED_RECORD_SET_ID = process.env.E2E_FLAGGED_RECORD_SET_ID || 'a0r0t000001y7rd'

// Change to false to see tests running on browser locally
export const HEADLESS = true
