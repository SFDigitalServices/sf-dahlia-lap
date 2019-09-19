import sharedSteps from '../../support/puppeteer/steps/sharedSteps'
import {
  LEASE_UP_LISTING_APPLICATION_ID,
  DEFAULT_E2E_TIME_OUT
} from '../../support/puppeteer/consts'
import supplementalApplicationSteps from '../../support/puppeteer/steps/supplementalApplicationSteps'
import SetupBrowserAndPage from '../../utils/SetupBrowserAndPage'
let testBrowser

describe('SupplementalApplicationPage Rental Assistance Information section', () => {
  test('should allow a new rental assistance to be created', async () => {
    let { browser, page } = await SetupBrowserAndPage()
    testBrowser = browser

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
    const amount = 1100
    const [recipientVal, recipientLabel] = await page.$eval(
      '.rental-assistance-new-form .rental-assistance-recipient option:nth-child(2)',
      e => [e.value, e.textContent]
    )

    // Record how many rental assistances are in the table before we attempt our create
    const prevTableSize = await page.$$eval('.rental-assistances > tbody > .tr-expand', elems => elems.length)

    // Fill out the new rental assistance form
    await page.select('.rental-assistance-new-form .rental-assistance-type', typeVal)
    await page.click('.rental-assistance-new-form .rental-assistance-recurring input')
    // Enter the amount, as a string with "$" in it to test saving a currency value
    await page.type('.rental-assistance-new-form #assistance_amount', `$${amount}`)
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
    expect(newAmount).toEqual('$1,100.00')
    expect(newRecipient).toEqual(recipientLabel)
  }, DEFAULT_E2E_TIME_OUT)

  // This test requires a rental assistance to be already present in the rental
  // assistances table. If the prior test for creating a rental assistance has
  // succeeded, then there will be at least one rental assistance present.
  test('should allow a rental assistance to be updated', async () => {
    let { page } = await SetupBrowserAndPage(testBrowser)

    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    // Click the Edit button on the first rental assistance
    const firstRentalAssistanceSelector = '.rental-assistances > tbody > .tr-expand:first-child'
    await page.click(`${firstRentalAssistanceSelector} button.action-link`)

    // Wait for the edit rental assistance form to open
    await page.waitForSelector('.rental-assistance-edit-form')

    // A hack to clear the amount field. Setting the value did't work
    await page.focus('#assistance_amount')
    const inputValue = await page.$eval('#assistance_amount', el => el.value)
    for (let i = 0; i < inputValue.length; i++) {
      await page.keyboard.press('Backspace')
    }

    // Enter a new amount value
    const amount = 1100
    // Enter the amount, as a string with "$" in it to test saving a currency value
    await page.type('#assistance_amount', `$${amount}`)

    // Save the edit rental assistance form
    await page.click('.rental-assistance-edit-form button.primary')

    // Wait for the API rental assistance update call to complete
    await page.waitForResponse(request => request.url().includes('http://localhost:3000/api/v1/rental-assistances'))

    // Check that the first rental assistance's amount value matches the value we updated it to
    const newAmount = await page.$eval(`${firstRentalAssistanceSelector} td:nth-child(3)`, e => e.textContent)
    expect(newAmount).toEqual('$1,100.00')

    await page.click(`${firstRentalAssistanceSelector} button.action-link`)

    const newAmountValue = await page.$eval('#assistance_amount', e => e.value)
    expect(newAmountValue).toEqual('$1,100.00')
  }, DEFAULT_E2E_TIME_OUT)

  // This test requires a rental assistance to be already present in the rental
  // assistances table. If the prior test for creating a rental assistance has
  // succeeded, then there will be at least one rental assistance present.
  test('should allow a rental assistance to be deleted', async () => {
    let { page } = await SetupBrowserAndPage(testBrowser)

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
  }, DEFAULT_E2E_TIME_OUT)

  // This test requires a rental assistance to be already present in the rental
  // assistances table. If the prior test for creating a rental assistance has
  // succeeded, then there will be at least one rental assistance present.
  test(
    'should save all supp app form values when a rental assistance panel is saved',
    async () => {
      let { page } = await SetupBrowserAndPage(testBrowser)

      await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

      // Change a value on the supp app form outside of the rental assistance panels
      // (and also outside of the confirmed preference panels)
      // A hack to clear the household assets field. Using the enterValue function didn't work.
      const hhAssetsSelector = '#form-household_assets'
      await page.focus(hhAssetsSelector)
      const inputValue = await page.$eval(hhAssetsSelector, el => el.value)
      for (let i = 0; i < inputValue.length; i++) {
        await page.keyboard.press('Backspace')
      }

      // Enter a new amount value
      const hhAssetsNewValue = supplementalApplicationSteps.generateRandomCurrency()
      await page.type(hhAssetsSelector, hhAssetsNewValue.currency)

      // Save a rental assistance panel

      // Click the Edit button on the first rental assistance
      const firstRentalAssistanceSelector = '.rental-assistances > tbody > .tr-expand:first-child'
      await page.click(`${firstRentalAssistanceSelector} button.action-link`)

      // Wait for the edit rental assistance form to open
      await page.waitForSelector('.rental-assistance-edit-form')

      // Save the edit rental assistance form
      await page.click('.rental-assistance-edit-form button.primary')

      // Wait for the API rental assistance update call to complete
      await page.waitForResponse(request =>
        request.url().includes('http://localhost:3000/api/v1/rental-assistances')
      )

      // Check that the field we changed outside of the rental assistance panel
      // still has the new value we entered
      const hhAssetsValue = await sharedSteps.getInputValue(page, hhAssetsSelector)
      expect(hhAssetsValue).toEqual(hhAssetsNewValue.currency)

      await testBrowser.close()
    },
    DEFAULT_E2E_TIME_OUT
  )
})
