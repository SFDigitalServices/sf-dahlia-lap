// Default to Automated Test Listing on Full
export const NON_LEASE_UP_LISTING_ID =
  process.env.E2E_NON_LEASE_UP_LISTING_ID || 'a0W0P00000F8YG4UAN'

// Default to Yellow Acres on Full
export const LEASE_UP_LISTING_ID = process.env.E2E_LEASE_UP_LISTING_ID || 'a0W0P00000GbyuQ'

// Default to an application from Yellow Acres on Full
export const LEASE_UP_LISTING_APPLICATION_ID =
  process.env.E2E_LEASE_UP_LISTING_APPLICATION_ID || 'a0o0P00000GZazOQAT'
export const FIRST_ROW_LEASE_UP_APP_ID =
  process.env.FIRST_ROW_LEASE_UP_APP_ID || 'a0o0P00000IvWgcQAF'
export const SECOND_ROW_LEASE_UP_APP_ID =
  process.env.SECOND_ROW_LEASE_UP_APP_ID || 'a0o0P00000GZazsQAD'
export const THIRD_ROW_LEASE_UP_APP_ID =
  process.env.THIRD_ROW_LEASE_UP_APP_ID || 'a0o0P00000IvWgXQAV'

export const DEFAULT_E2E_TIME_OUT = 240000 // 4 minutes

// Default to Sale Test Listing Homeownership Acres on Full
export const SALE_LISTING_ID = process.env.E2E_SALE_LISTING_ID || 'a0W0P00000GlKfBUAV'

// Default to sample flagged record set on full
export const FLAGGED_RECORD_SET_ID = process.env.E2E_FLAGGED_RECORD_SET_ID || 'a0r0P00002WqGZ6QAN'

// Application Fields
export const FIRST_NAME = 'VERY_LONG_FIRST_NAME_THAT_IS_EXACTLY_40!NOWOVER'
export const LAST_NAME = 'VERY_LONG_LAST_NAME_THAT_IS_EXACTLY_40!!NOWOVER'

export const TRUNCATED_FIRST_NAME = 'VERY_LONG_FIRST_NAME_THAT_IS_EXACTLY_40!'
export const TRUNCATED_LAST_NAME = 'VERY_LONG_LAST_NAME_THAT_IS_EXACTLY_40!!'
export const DOB_MONTH = '03'
export const DOB_DAY = '04'
export const DOB_YEAR = '1983'
export const DATE_OF_BIRTH = '03/04/1983'

export const HOUSEHOLD_MEMBER_FIRST_NAME = 'HM first name'
export const HOUSEHOLD_MEMBER_LAST_NAME = 'HM last name'
export const HOUSEHOLD_MEMBER_DATE_OF_BIRTH = '01/12/1980'
export const HOUSEHOLD_MEMBER_DOB_MONTH = '1'
export const HOUSEHOLD_MEMBER_DOB_DAY = '12'
export const HOUSEHOLD_MEMBER_DOB_YEAR = '1980'

// Loan officer info for paper sale application
export const LENDING_INSTITUTION = process.env.E2E_LENDING_INSTITUTION || 'Chase'
export const LENDING_AGENT_ID = process.env.E2E_LENDING_AGENT_ID || '0030P00002NI63uQAD'

export const DECLINE_TO_STATE = 'Decline to state'

// Change to false to see tests running on browser locally
export const HEADLESS = true
// Change to true to see devtools, only works if HEADLESS is false since you need to open up a Chromium browser
export const DEVTOOLS = false
// Change to false to fall back to including css
export const REMOVECSS = process.env.E2E_REMOVE_CSS || true
