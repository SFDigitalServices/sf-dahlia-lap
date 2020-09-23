import sharedSteps from '../../support/puppeteer/steps/sharedSteps'
import supplementalApplicationSteps from '../../support/puppeteer/steps/supplementalApplicationSteps'
import {
  LEASE_UP_LISTING_APPLICATION_ID,
  DEFAULT_E2E_TIME_OUT
} from '../../support/puppeteer/consts'
import SetupBrowserAndPage from '../../utils/SetupBrowserAndPage'
let testBrowser

describe('SupplementalApplicationPage status history', () => {
  test('should allow status updates via the Add a Comment button in the status history section', async () => {
    let { browser, page } = await SetupBrowserAndPage()
    testBrowser = browser

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    // Click on the "Add a Comment" button in the Status History sidebar
    await page.click('#add-status-history-comment')

    await supplementalApplicationSteps.testStatusModalUpdate(page)
  }, DEFAULT_E2E_TIME_OUT)
})

describe('SupplementalApplicationPage action buttons', () => {
  test('should allow status updates via the status dropdown in the sidebar', async () => {
    let { page } = await SetupBrowserAndPage(testBrowser, true)

    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    // Click on the status dropdown button at the bottom of the page
    await page.click('.status-history-buttons button.dropdown-button ')

    // Select a status from the dropdown menu
    await page.click('.status-history-buttons li[aria-selected="false"].dropdown-menu_item a:first-child')

    await supplementalApplicationSteps.testStatusModalUpdate(page)

    await testBrowser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
