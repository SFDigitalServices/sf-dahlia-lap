import puppeteer from 'puppeteer'

import utils from '../../support/puppeteer/utils'
import sharedSteps from '../../support/puppeteer/steps/sharedSteps'
import {
  LEASE_UP_LISTING_APPLICATION_ID,
  DEFAULT_E2E_TIME_OUT,
  HEADLESS
} from '../../support/puppeteer/consts'

describe('SupplementalApplicationPage confirm modal', () => {
  test('should pop up if there was a change in an application field', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    // Click on the Senior Houshold Input under Confirmed Household
    await page.click('#reserved_senior-yes')
    await page.click('#reserved_senior-no')

    // Click on Original Short Form Application Tab
    await page.click('.tabs li:nth-child(1)')

    const hasConfirmModal = await utils.isPresent(page, '#leave-confirmation-modal')
    expect(hasConfirmModal).toBe(true)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
