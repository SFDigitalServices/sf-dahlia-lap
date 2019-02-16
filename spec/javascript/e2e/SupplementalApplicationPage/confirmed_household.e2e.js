import puppeteer from 'puppeteer'

import sharedSteps from '../../support/puppeteer/steps/sharedSteps'
import supplementalApplicationSteps from '../../support/puppeteer/steps/supplementalApplicationSteps'
import {
  LEASE_UP_LISTING_APPLICATION_ID,
  DEFAULT_E2E_TIME_OUT,
  HEADLESS
} from '../../support/puppeteer/consts'

describe('SupplementalApplicationPage confirmed household income section', () => {
  test('should allow saving of assets and incomes', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    const hhAssetsSelector = '#household_assets'
    const confirmedAnnualSelector = '#confirmed_household_annual_income'
    const finalHHAnnualSelector = '#hh_total_income_with_assets_annual'

    // Generate the values (with currency and non-currency strings)
    const hhAssetsValue = supplementalApplicationSteps.generateRandomCurrency()
    const confirmedAnnualValue = supplementalApplicationSteps.generateRandomCurrency()
    const finalHHAnnualValue = supplementalApplicationSteps.generateRandomCurrency()

    // Enter them
    await supplementalApplicationSteps.enterValue(page, hhAssetsSelector, hhAssetsValue.currency)
    await supplementalApplicationSteps.enterValue(page, confirmedAnnualSelector, confirmedAnnualValue.currency)
    await supplementalApplicationSteps.enterValue(page, finalHHAnnualSelector, finalHHAnnualValue.currency)

    // Click save
    await supplementalApplicationSteps.savePage(page)

    // Wait for page to load
    await page.waitForNavigation()

    // Verify that the values are there (as numbers, not currency)
    expect(await supplementalApplicationSteps.getValue(page, hhAssetsSelector)).toEqual(String(hhAssetsValue.float))
    expect(await supplementalApplicationSteps.getValue(page, confirmedAnnualSelector)).toEqual(confirmedAnnualValue.float)
    expect(await supplementalApplicationSteps.getValue(page, finalHHAnnualSelector)).toEqual(finalHHAnnualValue.float)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
