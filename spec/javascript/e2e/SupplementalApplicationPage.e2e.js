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

  test.only('should allow new rental assistances to be created', async () => {
    // let browser = await puppeteer.launch({ headless: false, slowMo: 150 })
    let browser = await puppeteer.launch({ headless: false })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    // Click on the Add Rental Assistance button in the Rental Assistance section
    await page.click('button#add-rental-assistance')

    // Wait for the rental assistance form to appear
    await page.waitForSelector('.rental-assistance-form')

    // // Set up the values we'll use to fill out the rental assistance form
    const [typeVal] = await page.$eval(
      '.rental-assistance-form .rental-assistance-type option:nth-child(2)',
      e => [e.value, e.textContent]
    )
    // const recurring = 'Yes'
    const amount = 100
    const [recipientVal] = await page.$eval(
      '.rental-assistance-form .rental-assistance-recipient option:nth-child(2)',
      e => [e.value, e.textContent]
    )

    const tableSize = await page.$$eval('.rental-assistances tr', e => e.length)

    // Fill out the rental assistance form with the values we want
    await page.select('.rental-assistance-form-new .rental-assistance-type', typeVal)
    await page.click('#recurring_assistance-new-yes')
    await page.type('.rental-assistance-form-new #assistance_amount', `${amount}`)
    await page.select('.rental-assistance-form-new .rental-assistance-recipient', recipientVal)

    // Save the rental assistance form
    await page.click('.rental-assistance-form-new button.primary')

    // Wait for the API rental assistance create call to complete
    await page.waitForResponse(request => request.url().includes('http://localhost:3000/api/v1/rental-assistances'))

    // Reload the page
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    // Rental assistance tabel should have increased in size.
    const currentTableSize = await page.$$eval('.rental-assistances tr', e => e.length)

    expect(currentTableSize).toBeGreaterThan(tableSize)

    browser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
