// Default to Automated Test Listing on Full
export const NON_LEASE_UP_LISTING_ID = process.env.E2E_NON_LEASE_UP_LISTING_ID || 'a0W0P00000F8YG4UAN'

// Default to Yellow Acres on Full
export const LEASE_UP_LISTING_ID = process.env.E2E_LEASE_UP_LISTING_ID || 'a0W0U000000MX4vUAG'

// Default to an application from Yellow Acres on Full
export const LEASE_UP_LISTING_APPLICATION_ID = process.env.E2E_LEASE_UP_LISTING_APPLICATION_ID || 'a0o0U000000VVwcQAG'

export const DEFAULT_E2E_TIME_OUT = 260000

// Change to false to see tests running on browser locally
export const HEADLESS = true
