import puppeteer from 'puppeteer'

import utils from '../../support/puppeteer/utils'
import sharedSteps from '../../support/puppeteer/steps/sharedSteps'
import {
  LEASE_UP_LISTING_APPLICATION_ID,
  DEFAULT_E2E_TIME_OUT,
  HEADLESS
} from '../../support/puppeteer/consts'
import IgnoreImageAndCSSLoad from '../../utils/IgnoreAssets'

describe('SupplementalApplicationPage confirm modal', () => {
  test('should pop up if there was a change in an application field', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()
    IgnoreImageAndCSSLoad(page)

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    // Change value for ada priorities, mobility impairments
    await page.click('input#form-has_ada_priorities_selected\\.mobility_impairments')

    // Click on Original Short Form Application Tab
    await page.click('.tabs li:nth-child(1)')

    const hasConfirmModal = await utils.isPresent(page, '#leave-confirmation-modal')
    expect(hasConfirmModal).toBe(true)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)
  test('should not show pop up if there was not a change in an application field', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()
    IgnoreImageAndCSSLoad(page)

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    page.waitForSelector('.tabs').then(() => page.click('.tabs li:nth-child(1)'))
    await page.waitForNavigation()

    // Verify that we're now on the application snapshot page
    expect(page.url()).toBe(`http://localhost:3000/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
