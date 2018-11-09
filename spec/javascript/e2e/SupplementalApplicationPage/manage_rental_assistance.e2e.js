import puppeteer from 'puppeteer'

import sharedSteps from '../support/puppeteer/steps/sharedSteps'
import {
  LEASE_UP_LISTING_APPLICATION_ID,
  DEFAULT_E2E_TIME_OUT,
  HEADLESS
} from '../support/puppeteer/consts'

describe('SupplementalApplicationPage manage rental assistance', () => {
  test('should allow a new rental assistance to be created', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    // Click on the Add Rental Assistance button in the Rental Assistance section
    await page.click('button#add-rental-assistance')

    // Wait for the new rental assistance form to appear
    await page.waitForSelector('.rental-assistance-new-form')

    // Set up the values we'll use to fill out the rental assistance form
    const [typeVal, typeLabel] = await page.$eval(
      '.rental-assistance-new-form .rental-assistance-type option:nth-child(2)',
      e => [e.value, e.textContent]
    )
    const recurring = 'Yes'
    const amount = 100
    const [recipientVal, recipientLabel] = await page.$eval(
      '.rental-assistance-new-form .rental-assistance-recipient option:nth-child(2)',
      e => [e.value, e.textContent]
    )

    // Record how many rental assistances are in the table before we attempt our create
    const prevTableSize = await page.$$eval('.rental-assistances > tbody > .tr-expand', elems => elems.length)

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
    const newTableSize = await page.$$eval('.rental-assistances > tbody > .tr-expand', elems => elems.length)
    expect(newTableSize).toEqual(prevTableSize + 1)

    // Check that the last rental assistance in table has the values we saved
    const lastRentalAssistanceSelector = '.rental-assistances > tbody > .tr-expand:nth-last-child(2)'
    const newTypeLabel = await page.$eval(`${lastRentalAssistanceSelector} td:nth-child(1)`, e => e.textContent)
    const newRecurring = await page.$eval(`${lastRentalAssistanceSelector} td:nth-child(2)`, e => e.textContent)
    const newAmount = await page.$eval(`${lastRentalAssistanceSelector} td:nth-child(3)`, e => e.textContent)
    const newRecipient = await page.$eval(`${lastRentalAssistanceSelector} td:nth-child(4)`, e => e.textContent)
    expect(newTypeLabel).toEqual(typeLabel)
    expect(newRecurring).toEqual(recurring)
    expect(newAmount).toEqual(`$${amount}`)
    expect(newRecipient).toEqual(recipientLabel)

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

    // Click the Edit button on the first rental assistance
    const firstRentalAssistanceSelector = '.rental-assistances > tbody > .tr-expand:first-child'
    await page.click(`${firstRentalAssistanceSelector} button.action-link`)

    // Wait for the edit rental assistance form to open
    await page.waitForSelector('.rental-assistance-edit-form')

    // Record the amount value
    const prevAmountValue = await page.$eval('.rental-assistance-edit-form #assistance_amount', e => e.value)

    // Clear the amount field
    await page.evaluate(() => {
      document.querySelector('.rental-assistance-edit-form #assistance_amount').value = ''
    })

    // Enter a new amount value
    const amount = parseInt(prevAmountValue) + 100
    await page.type('.rental-assistance-edit-form #assistance_amount', `${amount}`)

    // Save the edit rental assistance form
    await page.click('.rental-assistance-edit-form button.primary')

    // Wait for the API rental assistance update call to complete
    await page.waitForResponse(request => request.url().includes('http://localhost:3000/api/v1/rental-assistances'))

    // Check that the first rental assistance's amount value matches the value we updated it to
    const newAmount = await page.$eval(`${firstRentalAssistanceSelector} td:nth-child(3)`, e => e.textContent)
    expect(newAmount).toEqual(`$${amount}`)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)

  // This test requires a rental assistance to be already present in the rental
  // assistances table. If the prior test for creating a rental assistance has
  // succeeded, then there will be at least one rental assistance present.
  test('should allow a rental assistance to be deleted', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    // Record how many rental assistances are in the table before we attempt our delete
    const prevTableSize = await page.$$eval('.rental-assistances > tbody > .tr-expand', elems => elems.length)

    // Click the Edit button on the first rental assistance
    const firstRentalAssistanceSelector = '.rental-assistances > tbody > .tr-expand:first-child'
    await page.click(`${firstRentalAssistanceSelector} button.action-link`)

    // Wait for the edit rental assistance form to open
    await page.waitForSelector('.rental-assistance-edit-form')

    // Delete the rental assistance
    await page.click('.rental-assistance-edit-form button.alert-fill')

    // Wait for the API rental assistance delete call to complete
    await page.waitForResponse(request => request.url().includes('http://localhost:3000/api/v1/rental-assistances'))

    // Check that the rental assistances table has decreased in size by one
    const newTableSize = await page.$$eval('.rental-assistances > tbody > .tr-expand', elems => elems.length)
    expect(newTableSize).toEqual(prevTableSize - 1)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
