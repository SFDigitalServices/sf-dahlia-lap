import {
  LEASE_UP_LISTING_APPLICATION_ID,
  DEFAULT_E2E_TIME_OUT
} from '../../support/puppeteer/consts'
import { unselectedStatusMenuItem } from '../../support/puppeteer/steps/leaseUpStatusSteps'
import sharedSteps from '../../support/puppeteer/steps/sharedSteps'
import supplementalApplicationSteps from '../../support/puppeteer/steps/supplementalApplicationSteps'
import SetupBrowserAndPage from '../../utils/SetupBrowserAndPage'
let testBrowser

describe('SupplementalApplicationPage status history', () => {
  test(
    'should allow status updates via the Add a Comment button in the status history section',
    async () => {
      const { browser, page } = await SetupBrowserAndPage()
      testBrowser = browser

      await sharedSteps.loginAsAgent(page)
      await sharedSteps.goto(page, `/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)
      await page.waitForSelector('button#save-supplemental-application')

      // Click on the "Add a Comment" button in the Status History sidebar
      await page.click('#add-status-history-comment')

      await supplementalApplicationSteps.testStatusModalUpdate(page)
    },
    DEFAULT_E2E_TIME_OUT
  )
})

describe('SupplementalApplicationPage action buttons', () => {
  test(
    'should allow status updates via the status dropdown in the sidebar',
    async () => {
      const { page } = await SetupBrowserAndPage(testBrowser, true)

      await sharedSteps.goto(page, `/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)
      await page.waitForSelector('button#save-supplemental-application')

      // Click on the status dropdown button at the bottom of the page
      await page.click('.status-history-buttons button.dropdown-button ')

      // Select a status from the dropdown menu
      await page.click('.status-history-buttons ' + unselectedStatusMenuItem)

      await supplementalApplicationSteps.testStatusModalUpdate(page)

      await testBrowser.close()
    },
    DEFAULT_E2E_TIME_OUT
  )
})
