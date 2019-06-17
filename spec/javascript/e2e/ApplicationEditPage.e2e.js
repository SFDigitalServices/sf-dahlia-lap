import puppeteer from 'puppeteer'

import sharedSteps from '../support/puppeteer/steps/sharedSteps'
import { DEFAULT_E2E_TIME_OUT, HEADLESS, LEASE_UP_LISTING_APPLICATION_ID } from '../support/puppeteer/consts'

describe('ApplicationEditPage', () => {
  test('should redirect when lottery_status is anything other than "Not Yet Run"', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/edit`)
    await page.waitFor(2000)

    const currentUrl = page.url()
    expect(currentUrl).toContain(`http://localhost:3000/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)
    expect(currentUrl).not.toContain(`edit`)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
