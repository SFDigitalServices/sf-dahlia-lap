import puppeteer from 'puppeteer'

import sharedSteps from '../../support/puppeteer/steps/sharedSteps'
import {
  LEASE_UP_LISTING_APPLICATION_ID,
  DEFAULT_E2E_TIME_OUT,
  HEADLESS
} from '../../support/puppeteer/consts'

const getUnselectedOptSelector = (fieldSelector) => {
  return `${fieldSelector} option:not(:checked):not(:disabled)`
}

const getSelectedOptSelector = (fieldSelector) => {
  return `${fieldSelector} option:checked`
}

describe('SupplementalApplicationPage Confirmed Preferences section', () => {
  test('should allow updates to live/work preference', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)

    // The application used here must include a claimed live/work
    // preference for this test to be able to pass.
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    const liveWorkEditSelector = '[id$=in-san-francisco-preference-edit]'
    const liveWorkRowSelector = '[id$=in-san-francisco-preference-row]'
    const liveWorkExpandedPanelSelector = '[id$=in-san-francisco-preference-panel]'

    // Click on the live/work preference's Edit button in the Confirmed
    // Preferences section to expand that preference's edit panel
    await page.click(liveWorkEditSelector)

    // Update the individual preference (select Live vs Work in SF)
    const individualPreferenceSelector = '.individual-preference-select'
    const unselectedPreferenceSelector = getUnselectedOptSelector(individualPreferenceSelector)
    const prefToSetName = await page.$eval(unselectedPreferenceSelector, e => e.textContent)
    const prefToSetValue = await page.$eval(unselectedPreferenceSelector, e => e.value)
    await page.select(individualPreferenceSelector, prefToSetValue)

    // Update the type of proof
    const typeOfProofSelector = '.type-of-proof-select'
    const unselectedTypeOfProofSelector = getUnselectedOptSelector(typeOfProofSelector)
    const typeOfProofToSetName = await page.$eval(unselectedTypeOfProofSelector, e => e.textContent)
    const typeOfProofToSetValue = await page.$eval(unselectedTypeOfProofSelector, e => e.value)
    await page.select(typeOfProofSelector, typeOfProofToSetValue)

    // Update the preference status
    const prefStatusSelector = '.preference-status-select'
    const unselectedPrefStatusSelector = getUnselectedOptSelector(prefStatusSelector)
    const prefStatusToSetName = await page.$eval(unselectedPrefStatusSelector, e => e.textContent)
    const prefStatusToSetValue = await page.$eval(unselectedPrefStatusSelector, e => e.value)
    await page.select(prefStatusSelector, prefStatusToSetValue)

    // Click the save button in the preference panel
    await page.click(`${liveWorkExpandedPanelSelector} .save-panel-btn`)

    // Wait for the API preference update call to complete
    await page.waitForResponse(request => request.url().includes('http://localhost:3000/api/v1/preferences/'))

    // Validate that the panel has collapsed

    // Validate that values were updated in the table.

    // Reload the page
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    // Open the same preference edit panel as before
    await page.waitForSelector(`${liveWorkRowSelector}`)
    await page.click(liveWorkEditSelector)

    // Check that the value entered for individual preference, type of proof, and status were successfully saved
    // and now appears in the preference panel
    const currentIndividualPref = await page.$eval(getSelectedOptSelector(individualPreferenceSelector), e => e.textContent)
    expect(currentIndividualPref).toBe(prefToSetName)

    const currentTypeOfProof = await page.$eval(getSelectedOptSelector(typeOfProofSelector), e => e.textContent)
    expect(currentTypeOfProof).toBe(typeOfProofToSetName)

    const currentStatus = await page.$eval(getSelectedOptSelector(prefStatusSelector), e => e.textContent)
    expect(currentStatus).toBe(prefStatusToSetName)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)

  // test('should allow updates to assisted housing preference', async () => {
  //   let browser = await puppeteer.launch({ headless: HEADLESS })
  //   let page = await browser.newPage()

  //   await sharedSteps.loginAsAgent(page)

  //   // The application used here must include a claimed and editable
  //   // preference as its first preference for this test to be able to pass.
  //   await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

  //   const firstRowSelector = '.tr-expand:first-child'
  //   const firstPanelSelector = `${firstRowSelector} + .tr-expand-content`
  //   const statusFieldSelector = `${firstPanelSelector} .form-grid_item:last-child select`
  //   const unselectedStatusOptSelector = `${statusFieldSelector} option:not(:checked):not(:disabled)`
  //   const selectedStatusOptSelector = `${statusFieldSelector} option:checked`

  //   // Click on the first preference's Edit button in the Confirmed
  //   // Preferences section to expand that preference's edit panel
  //   await page.click(`${firstRowSelector} .button-link`)

  //   // Find an unselected option value in the panel's Status select field
  //   const statusToSetName = await page.$eval(unselectedStatusOptSelector, e => e.textContent)
  //   const statusToSetValue = await page.$eval(unselectedStatusOptSelector, e => e.value)

  //   // Set the Status field value in the preference panel to that new value.
  //   // Puppeteer's select function takes the value attr of the option, not the
  //   // text content of the option. So if you're trying to select an option that
  //   // looks like <option value="1">First</option>, you would pass 1 as the
  //   // second arg to page.select, not "First".
  //   await page.select(statusFieldSelector, statusToSetValue)

  //   // Update the type of proof

  //   // Click the save button in the preference panel
  //   await page.click(`${firstPanelSelector} .button.primary`)

  //   // Wait for the API preference update call to complete
  //   await page.waitForResponse(request => request.url().includes('http://localhost:3000/api/v1/preferences/'))

  //   // Reload the page
  //   await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

  //   // Open the same preference edit panel as before
  //   await page.waitForSelector(`${firstRowSelector}`)
  //   await page.click(`${firstRowSelector} .button-link`)

  //   // Check that the value entered for Status was successfully saved
  //   // and now appears in the preference panel
  //   const currentStatus = await page.$eval(selectedStatusOptSelector, e => e.textContent)
  //   expect(currentStatus).toBe(statusToSetName)

  //   await browser.close()
  // }, DEFAULT_E2E_TIME_OUT)
})
