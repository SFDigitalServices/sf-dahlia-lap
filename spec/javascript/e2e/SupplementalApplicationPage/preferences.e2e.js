import puppeteer from 'puppeteer'

import sharedSteps from '../support/puppeteer/steps/sharedSteps'
import {
  LEASE_UP_LISTING_APPLICATION_ID,
  DEFAULT_E2E_TIME_OUT,
  HEADLESS
} from '../support/puppeteer/consts'

describe('SupplementalApplicationPage preferences', () => {
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
