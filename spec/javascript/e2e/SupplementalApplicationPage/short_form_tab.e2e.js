import {
  LEASE_UP_LISTING_APPLICATION_ID,
  DEFAULT_E2E_TIME_OUT
} from '../../support/puppeteer/consts'
import sharedSteps from '../../support/puppeteer/steps/sharedSteps'
import SetupBrowserAndPage from '../../utils/SetupBrowserAndPage'
let testBrowser
const mobilitySelector = 'input#form-has_ada_priorities_selected\\.mobility_impairments'
const shortFormTabSelector = '.tabs li:nth-child(2)'
const supplementalTabSeletor = '.tabs li:nth-child(1)'
describe('SupplementalApplicationPage clicking on the short form tab', () => {
  test(
    'should not erase updates made on the supp app tab',
    async () => {
      const { browser, page } = await SetupBrowserAndPage(null, true)
      testBrowser = browser
      await sharedSteps.loginAsAgent(page)

      // Load the supp app
      await sharedSteps.goto(page, `/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)
      await page.waitForSelector('button#save-supplemental-application')

      const originalCheckboxValue = await sharedSteps.getCheckboxVal(page, mobilitySelector)
      // Change value for ada priorities, mobility impairments
      await page.click(mobilitySelector)
      const checkboxAfterClick = await sharedSteps.getCheckboxVal(page, mobilitySelector)
      expect(checkboxAfterClick).not.toEqual(originalCheckboxValue)

      // Click on Short Form Application Tab
      await page.click(shortFormTabSelector)

      // Expect that the short form application shows
      const shortFormText = await sharedSteps.getText(page, '.application-details')
      expect(shortFormText).toContain('Application Data')

      // Click back to the supp app tab
      await page.click(supplementalTabSeletor)

      // Expect that the changes are still there
      const checkboxAfterTabSwitch = await sharedSteps.getCheckboxVal(page, mobilitySelector)
      expect(checkboxAfterTabSwitch).toEqual(checkboxAfterClick)

      await testBrowser.close()
    },
    DEFAULT_E2E_TIME_OUT
  )
})
