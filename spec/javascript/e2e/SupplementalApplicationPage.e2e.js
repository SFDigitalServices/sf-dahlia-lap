import puppeteer from 'puppeteer'

import sharedSteps from '../support/puppeteer/steps/sharedSteps'
import supplementalApplicationSteps from '../support/puppeteer/steps/supplementalApplicationSteps'
import {
  LEASE_UP_LISTING_APPLICATION_ID,
  DEFAULT_E2E_TIME_OUT,
  HEADLESS
} from '../support/puppeteer/consts'

describe('SupplementalApplicationPage', () => {
  test('should allow status updates via the Add a Comment button in the status history section', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    // Click on the "Add a Comment" button in the Status History section
    await page.click('.status-list_footer button')

    await supplementalApplicationSteps.testStatusModalUpdate(page)

    browser.close()
  }, DEFAULT_E2E_TIME_OUT)
  test('should allow status updates via the status dropdown at the bottom of the page', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    // Click on the status dropdown button at the bottom of the page
    await page.click('.button-pager .dropdown')

    // Select a status from the dropdown menu
    await page.click('.button-pager .dropdown-menu li[aria-selected="false"] a:first-child')

    await supplementalApplicationSteps.testStatusModalUpdate(page)

    browser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
