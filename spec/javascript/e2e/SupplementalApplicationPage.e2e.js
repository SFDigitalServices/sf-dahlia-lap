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

    await browser.close()
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

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)

  test('should allow  new rental assistance to be created', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    // Click on the Add Rental Assistance button in the Rental Assistance section
    await page.click('button#add-rental-assistance')

    // Wait for the new rental assistance form to appear
    await page.waitForSelector('.rental-assistance-new-form')

    // Set up the values we'll use to fill out the rental assistance form
    const [typeVal] = await page.$eval(
      '.rental-assistance-new-form .rental-assistance-type option:nth-child(2)',
      e => [e.value, e.textContent]
    )
    const amount = 100
    const [recipientVal] = await page.$eval(
      '.rental-assistance-new-form .rental-assistance-recipient option:nth-child(2)',
      e => [e.value, e.textContent]
    )

    // Record how many rental assistances are currently in the table
    const tableSize = await page.$$eval('.rental-assistances > tbody > .tr-expand', e => e.length)

    // Fill out the new rental assistance form
    await page.select('.rental-assistance-new-form .rental-assistance-type', typeVal)
    await page.click('#recurring_assistance-new-yes')
    await page.type('.rental-assistance-new-form #assistance_amount', `${amount}`)
    await page.select('.rental-assistance-new-form .rental-assistance-recipient', recipientVal)

    // Save the new rental assistance form
    await page.click('.rental-assistance-new-form button.primary')

    // Wait for the API rental assistance create call to complete
    await page.waitForResponse(request => request.url().includes('http://localhost:3000/api/v1/rental-assistances'))

    // Check that the rental assistances table has increased in size by one
    const currentTableSize = await page.$$eval('.rental-assistances > tbody > .tr-expand', e => e.length)
    expect(currentTableSize).toEqual(tableSize + 1)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)

  // This test requires a rental assistance to be already present in the rental
  // assistances table. If the prior test for creating a rental assistance has
  // succeeded, then there will be at least one rental assistance present.
  test('should allow a rental assistance to be updated', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    // Locate the first rental assistance

    // Click the Edit button on that rental assistance

    // Wait for the edit rental assistance form to open

    // Change the amount field

    // Save the edit rental assistance form

    // Wait for the API rental assistance update call to complete

    // Check that the first rental assistance's amount value matches the value we updated it to

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)

  test('should allow preference updates via the Confirmed Preferences section', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)

    // The application used here must include a claimed and editable
    // preference as its first preference for this test to be able to pass.
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    const firstRowSelector = '.tr-expand:first-child'
    const firstPanelSelector = `${firstRowSelector} + .tr-expand-content`
    const statusFieldSelector = `${firstPanelSelector} .form-grid_item:last-child select`
    const unselectedOptSelector = `${statusFieldSelector} option:not(:checked):not(:disabled)`
    const selectedOptSelector = `${statusFieldSelector} option:checked`

    // Click on the first preference's Edit button in the Confirmed
    // Preferences section to expand that preference's edit panel
    await page.click(`${firstRowSelector} .button-link`)

    // Find an unselected option value in the panel's Status select field
    const statusToSetName = await page.$eval(unselectedOptSelector, e => e.textContent)
    const statusToSetValue = await page.$eval(unselectedOptSelector, e => e.value)

    // Set the Status field value in the preference panel to that new value.
    // Puppeteer's select function takes the value attr of the option, not the
    // text content of the option. So if you're trying to select an option that
    // looks like <option value="1">First</option>, you would pass 1 as the
    // second arg to page.select, not "First".
    await page.select(statusFieldSelector, statusToSetValue)

    // Click the save button in the preference panel
    await page.click(`${firstPanelSelector} .button.primary`)

    // Wait for the API preference update call to complete
    await page.waitForResponse(request => request.url().includes('http://localhost:3000/api/v1/preferences/'))

    // Reload the page
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    // Open the same preference edit panel as before
    await page.click(`${firstRowSelector} .button-link`)

    // Check that the value entered for Status was successfully saved
    // and now appears in the preference panel
    const currentStatus = await page.$eval(selectedOptSelector, e => e.textContent)
    expect(currentStatus).toBe(statusToSetName)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
