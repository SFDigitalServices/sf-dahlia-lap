import puppeteer from 'puppeteer'

import sharedSteps from '../../support/puppeteer/steps/sharedSteps'
import supplementalApplicationSteps from '../../support/puppeteer/steps/supplementalApplicationSteps'
import {
  LEASE_UP_LISTING_APPLICATION_ID,
  DEFAULT_E2E_TIME_OUT,
  HEADLESS
} from '../../support/puppeteer/consts'

describe('SupplementalApplicationPage lease section', () => {
  test('should allow saving of rents', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    const rentSelector = '#total_monthly_rent_without_parking'
    const parkingRentSelector = '#monthly_parking_rent'
    const tenantContributionSelector = '#monthly_tenant_contribution'

    // Generate the values (with currency and non-currency strings)
    const rentValue = supplementalApplicationSteps.generateRandomCurrency()
    const parkingRentValue = supplementalApplicationSteps.generateRandomCurrency()
    const tenantContributionValue = supplementalApplicationSteps.generateRandomCurrency()

    // Enter them
    await supplementalApplicationSteps.enterValue(page, rentSelector, rentValue.currency)
    await supplementalApplicationSteps.enterValue(page, parkingRentSelector, parkingRentValue.currency)
    await supplementalApplicationSteps.enterValue(page, tenantContributionSelector, tenantContributionValue.currency)

    // Click save
    await supplementalApplicationSteps.savePage(page)

    // Wait for page to load
    await page.waitForNavigation()

    // Verify that the values are there (as numbers, not currency)
    expect(await supplementalApplicationSteps.getValue(page, rentSelector)).toEqual(String(rentValue.float))
    expect(await supplementalApplicationSteps.getValue(page, parkingRentSelector)).toEqual(parkingRentValue.float)
    expect(await supplementalApplicationSteps.getValue(page, tenantContributionSelector)).toEqual(tenantContributionValue.float)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
