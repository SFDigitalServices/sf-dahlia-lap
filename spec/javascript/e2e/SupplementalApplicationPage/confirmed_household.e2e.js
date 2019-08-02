import puppeteer from 'puppeteer'

import sharedSteps from '../../support/puppeteer/steps/sharedSteps'
import supplementalApplicationSteps from '../../support/puppeteer/steps/supplementalApplicationSteps'
import {
  LEASE_UP_LISTING_APPLICATION_ID,
  DEFAULT_E2E_TIME_OUT,
  HEADLESS
} from '../../support/puppeteer/consts'
import IgnoreImageAndCSSLoad from '../../utils/IgnoreAssets'

describe('SupplementalApplicationPage confirmed household income section', () => {
  test('should allow saving of assets and incomes', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()
    page = await IgnoreImageAndCSSLoad(page)

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    const hhAssetsSelector = '#form-household_assets'
    const confirmedAnnualSelector = '#form-confirmed_household_annual_income'
    const finalHHAnnualSelector = '#form-hh_total_income_with_assets_annual'

    // Generate the values (with currency and non-currency strings)
    const hhAssetsValue = supplementalApplicationSteps.generateRandomCurrency()
    const confirmedAnnualValue = supplementalApplicationSteps.generateRandomCurrency()
    const finalHHAnnualValue = supplementalApplicationSteps.generateRandomCurrency()

    // Enter them
    await sharedSteps.enterValue(page, hhAssetsSelector, hhAssetsValue.currency)
    await sharedSteps.enterValue(page, confirmedAnnualSelector, confirmedAnnualValue.currency)
    await sharedSteps.enterValue(page, finalHHAnnualSelector, finalHHAnnualValue.currency)

    // Click save
    await supplementalApplicationSteps.savePage(page)

    // Wait for page to load
    await page.waitForNavigation()

    // Verify that the values are there (as numbers, not currency)
    expect(await sharedSteps.getInputValue(page, hhAssetsSelector)).toEqual('$' + String(hhAssetsValue.float.toFixed(2)))
    expect(await sharedSteps.getInputValue(page, confirmedAnnualSelector)).toEqual('$' + String(confirmedAnnualValue.float.toFixed(2)))
    expect(await sharedSteps.getInputValue(page, finalHHAnnualSelector)).toEqual('$' + String(finalHHAnnualValue.float.toFixed(2)))

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
