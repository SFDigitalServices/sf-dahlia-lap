import {
  LEASE_UP_LISTING_APPLICATION_ID,
  DEFAULT_E2E_TIME_OUT
} from '../../support/puppeteer/consts'
import sharedSteps from '../../support/puppeteer/steps/sharedSteps'
import supplementalApplicationSteps from '../../support/puppeteer/steps/supplementalApplicationSteps'
import SetupBrowserAndPage from '../../utils/SetupBrowserAndPage'
let testBrowser

describe('SupplementalApplicationPage Confirmed Preferences section', () => {
  test(
    'should allow updates to live/work preference',
    async () => {
      const { browser, page } = await SetupBrowserAndPage()
      testBrowser = browser

      await sharedSteps.loginAsAgent(page)

      // The application used here must include a claimed live/work
      // preference for this test to be able to pass.
      await sharedSteps.goto(page, `/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)

      const liveWorkEditSelector = '[id$=in-san-francisco-preference-edit]'
      const liveWorkRowSelector = '[id$=in-san-francisco-preference-row]'
      const liveWorkExpandedPanelSelector = '[id$=in-san-francisco-preference-panel]'

      await page.waitForSelector(liveWorkEditSelector)
      // Click on the live/work preference's Edit button in the Confirmed
      // Preferences section to expand that preference's edit panel
      await page.click(liveWorkEditSelector)

      // Update the individual preference (select Live vs Work in SF)
      const individualPreferenceSelector = `${liveWorkExpandedPanelSelector} .individual-preference-select`
      const unselectedPreferenceSelector = sharedSteps.notSelectedOptionSelector(
        individualPreferenceSelector
      )
      const prefToSetName = await page.$eval(unselectedPreferenceSelector, (e) => e.textContent)
      const prefToSetValue = await page.$eval(unselectedPreferenceSelector, (e) => e.value)
      await page.select(individualPreferenceSelector, prefToSetValue)

      // Update the type of proof
      const typeOfProofSelector = `${liveWorkExpandedPanelSelector} .type-of-proof-select`
      const unselectedTypeOfProofSelector =
        sharedSteps.notSelectedOptionSelector(typeOfProofSelector)
      const typeOfProofToSetName = await page.$eval(
        unselectedTypeOfProofSelector,
        (e) => e.textContent
      )
      const typeOfProofToSetValue = await page.$eval(unselectedTypeOfProofSelector, (e) => e.value)
      await page.select(typeOfProofSelector, typeOfProofToSetValue)

      // Update the preference status
      const prefStatusSelector = `${liveWorkExpandedPanelSelector} .preference-status-select`
      const unselectedPrefStatusSelector = sharedSteps.notSelectedOptionSelector(prefStatusSelector)
      const prefStatusToSetName = await page.$eval(
        unselectedPrefStatusSelector,
        (e) => e.textContent
      )
      const prefStatusToSetValue = await page.$eval(unselectedPrefStatusSelector, (e) => e.value)
      await page.select(prefStatusSelector, prefStatusToSetValue)

      // Click the save button in the preference panel
      await page.click(`${liveWorkExpandedPanelSelector} .save-panel-btn`)

      // Wait for the API preference update call to complete
      await page.waitForResponse((request) =>
        request.url().includes('http://localhost:3000/api/v1/preferences/')
      )

      // Validate that the panel has collapsed
      const isCollapsed = await page.$eval(
        liveWorkExpandedPanelSelector,
        (e) => e.attributes['aria-hidden'].value
      )
      expect(isCollapsed).toBe('true')

      // Validate that values were updated in the table.
      const liveWorkRowValues = await page.$$eval(`${liveWorkRowSelector} td`, (tds) =>
        tds.map((td) => td.textContent)
      )

      expect(liveWorkRowValues[1]).toContain(prefToSetName.split(' ')[0]) // Check if both contain 'Live' or 'Work'. TODO: Find a less hacky way to do this
      expect(liveWorkRowValues[4]).toBe(typeOfProofToSetName)
      expect(liveWorkRowValues[5]).toBe(prefStatusToSetName)

      // Reload the page
      await sharedSteps.goto(page, `/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)

      // Open the same preference edit panel as before
      await page.waitForSelector(`${liveWorkRowSelector}`)
      await page.click(liveWorkEditSelector)

      // Check that the value entered for individual preference, type of proof, and status were successfully saved
      // and now appears in the preference panel
      const currentIndividualPref = await page.$eval(
        sharedSteps.selectedOptionSelector(individualPreferenceSelector),
        (e) => e.textContent
      )

      expect(currentIndividualPref).toBe(prefToSetName)

      const currentTypeOfProof = await page.$eval(
        sharedSteps.selectedOptionSelector(typeOfProofSelector),
        (e) => e.textContent
      )
      expect(currentTypeOfProof).toBe(typeOfProofToSetName)

      await page.waitForSelector(prefStatusSelector)
      const currentStatus = await page.$eval(
        sharedSteps.selectedOptionSelector(prefStatusSelector),
        (e) => e.textContent
      )
      expect(currentStatus).toBe(prefStatusToSetName)
    },
    DEFAULT_E2E_TIME_OUT
  )

  test(
    'should allow updates to assisted housing preference',
    async () => {
      const { page } = await SetupBrowserAndPage(testBrowser)

      // The application used here must include a claimed assisted housing
      // preference for this test to be able to pass.
      await sharedSteps.goto(page, `/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)

      const assistedHousingEditSelector = '#assisted-housing-preference-edit'
      const assistedHousingRowSelector = '#assisted-housing-preference-row'
      const assistedHousingExpandedPanelSelector = '#assisted-housing-preference-panel'

      await page.waitForSelector('#assisted-housing-preference-edit')
      // Click on the assisted housing preference's Edit button in the Confirmed
      // Preferences section to expand that preference's edit panel
      await page.click(assistedHousingEditSelector)

      // Update the preference status
      const prefStatusSelector = `${assistedHousingExpandedPanelSelector} .preference-status-select`
      const unselectedPrefStatusSelector = sharedSteps.notSelectedOptionSelector(prefStatusSelector)
      const prefStatusToSetName = await page.$eval(
        unselectedPrefStatusSelector,
        (e) => e.textContent
      )
      const prefStatusToSetValue = await page.$eval(unselectedPrefStatusSelector, (e) => e.value)
      await page.select(prefStatusSelector, prefStatusToSetValue)

      // Click the save button in the preference panel
      await page.click(`${assistedHousingExpandedPanelSelector} .save-panel-btn`)

      // Wait for the API preference update call to complete
      await page.waitForResponse((request) =>
        request.url().includes('http://localhost:3000/api/v1/preferences/')
      )

      // Validate that the panel has collapsed
      const isCollapsed = await page.$eval(
        assistedHousingExpandedPanelSelector,
        (e) => e.attributes['aria-hidden'].value
      )
      expect(isCollapsed).toBe('true')

      // Validate that values were updated in the table.
      const assistedHousingRowValues = await page.$$eval(
        `${assistedHousingRowSelector} td`,
        (tds) => tds.map((td) => td.textContent)
      )
      expect(assistedHousingRowValues[5]).toBe(prefStatusToSetName)

      // Reload the page
      await sharedSteps.goto(page, `/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)

      // Open the same preference edit panel as before
      await page.waitForSelector(`${assistedHousingRowSelector}`)
      await page.click(assistedHousingEditSelector)

      // Check that the value entered for status was successfully saved
      // and now appears in the preference panel
      const currentStatus = await page.$eval(
        sharedSteps.selectedOptionSelector(prefStatusSelector),
        (e) => e.textContent
      )
      expect(currentStatus).toBe(prefStatusToSetName)
    },
    DEFAULT_E2E_TIME_OUT
  )

  test(
    'should persist all unsaved supp app form values when a confirmed preference panel is saved',
    async () => {
      const { page } = await SetupBrowserAndPage(testBrowser)

      await sharedSteps.goto(page, `/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)

      // Change a value on the supp app form outside of the confirmed preference panels
      // (and also outside of the rental assistance panels)
      const hhAssetsSelector = '#form-household_assets'
      const hhAssetsNewValue = supplementalApplicationSteps.generateRandomCurrency()
      await sharedSteps.enterValue(page, hhAssetsSelector, hhAssetsNewValue.currency)

      // Save an update in a preference panel. We'll use the assisted housing preference.
      // The application used here must include a claimed assisted housing
      // preference for this test to be able to pass.

      // Click on the assisted housing preference's Edit button in the Confirmed
      // Preferences section to expand that preference's edit panel
      const assistedHousingEditSelector = '#assisted-housing-preference-edit'
      await page.waitForSelector(assistedHousingEditSelector)
      await page.click(assistedHousingEditSelector)

      // Update the preference status
      const assistedHousingExpandedPanelSelector = '#assisted-housing-preference-panel'
      const prefStatusSelector = `${assistedHousingExpandedPanelSelector} .preference-status-select`
      const unselectedPrefStatusSelector = sharedSteps.notSelectedOptionSelector(prefStatusSelector)
      const prefStatusToSetValue = await page.$eval(unselectedPrefStatusSelector, (e) => e.value)
      await page.select(prefStatusSelector, prefStatusToSetValue)

      // Click the save button in the preference panel
      await page.click(`${assistedHousingExpandedPanelSelector} .save-panel-btn`)

      // Wait for the API preference update call to complete
      await page.waitForResponse((request) =>
        request.url().includes('http://localhost:3000/api/v1/preferences/')
      )

      // Check that the field we changed outside of the preference panel
      // still has the new value we entered
      const hhAssetsValue = await sharedSteps.getInputValue(page, hhAssetsSelector)
      expect(hhAssetsValue).toEqual('$' + String(hhAssetsNewValue.float.toFixed(2)))

      await testBrowser.close()
    },
    DEFAULT_E2E_TIME_OUT
  )
})
