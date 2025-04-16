// import 'dotenv/config'
const { defineConfig } = require('cypress')
require('dotenv').config()

module.exports = defineConfig({
  defaultCommandTimeout: 10000,
  projectId: 'dahlia-lap-portal',
  pageLoadTimeout: 10000,
  reporterOptions: {
    mochaFile: 'cypress/results/tests-[hash].xml',
    toConsole: true
  },
  video: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    // setupNodeEvents(on, config) {
    //   return require('./cypress/plugins/index.js')(on, config)
    // },
    env: {
      salesforceInstanceUrl: process.env.SALESFORCE_INSTANCE_URL,
      SALESFORCE_USERNAME: process.env.E2E_SALESFORCE_USERNAME,
      SALESFORCE_PASSWORD: process.env.E2E_SALESFORCE_PASSWORD,
      LENDING_INSTITUTION: process.env.E2E_LENDING_INSTITUTION || 'Chase',
      LENDING_AGENT_ID: process.env.E2E_LENDING_AGENT_ID || '0030P00002NI63uQAD',
      COMMUNITY_LOGIN_URL: process.env.COMMUNITY_LOGIN_URL,
      // Default to Automated Test Listing on Full
      NON_LEASE_UP_LISTING_ID: process.env.E2E_NON_LEASE_UP_LISTING_ID || 'a0W0P00000F8YG4UAN',
      // Default to Yellow Acres on Full
      LEASE_UP_LISTING_ID: process.env.E2E_LEASE_UP_LISTING_ID || 'a0W0P00000GbyuQUAR',
      // Default to an application from Yellow Acres on Full
      LEASE_UP_LISTING_APPLICATION_ID:
        process.env.E2E_LEASE_UP_LISTING_APPLICATION_ID || 'a0o0P00000GZazOQAT',
      FIRST_ROW_LEASE_UP_APP_ID: process.env.FIRST_ROW_LEASE_UP_APP_ID || 'a0o0P00000IvWgcQAF',
      SECOND_ROW_LEASE_UP_APP_ID: process.env.SECOND_ROW_LEASE_UP_APP_ID || 'a0o0P00000GZazsQAD',
      THIRD_ROW_LEASE_UP_APP_ID: process.env.THIRD_ROW_LEASE_UP_APP_ID || 'a0o0P00000IvWgXQAV',
      // Default to Sale Test Listing Homeownership Acres on Full
      SALE_LISTING_ID: process.env.E2E_SALE_LISTING_ID || 'a0W0P00000GlKfBUAV',
      // Default to sample flagged record set on full
      FLAGGED_RECORD_SET_ID: process.env.E2E_FLAGGED_RECORD_SET_ID || 'a0r0P00002WqGZ6QAN',
      // Default to 400 China Basin in full
      FCFS_RENTAL_LISTING_ID: process.env.FCFS_RENTAL_LISTING_ID || 'a0W4U00000SWKbMUAX',
      // When this is turned to true, Cypress will log the Salesforce password to the console
      // This is useful for debugging, but should never be turned on in a PR
      LOG_SECRETS: false
    },
    experimentalOriginDependencies: true,
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    retries: 2
  },
  // workaround see https://github.com/dequelabs/axe-core/issues/3057
  modifyObstructiveCode: false,
  experimentalModifyObstructiveThirdPartyCode: true,
  chromeWebSecurity: false
})
