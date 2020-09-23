import utils from '../../support/puppeteer/utils'
import sharedSteps from '../../support/puppeteer/steps/sharedSteps'
import supplementalApplicationSteps from '../../support/puppeteer/steps/supplementalApplicationSteps'
import {
  LEASE_UP_LISTING_APPLICATION_ID,
  DEFAULT_E2E_TIME_OUT
} from '../../support/puppeteer/consts'
import SetupBrowserAndPage from '../../utils/SetupBrowserAndPage'
let testBrowser

describe('SupplementalApplicationPage confirm modal', () => {
  test('should pop up if there was a change in an application field', async () => {
    const { browser, page } = await SetupBrowserAndPage(null, true)
    testBrowser = browser

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    // Change value for ada priorities, mobility impairments
    await page.click('input#form-has_ada_priorities_selected\\.mobility_impairments')

    // Click on Original Short Form Application Tab
    await page.click('.tabs li:nth-child(1)')

    const hasConfirmModal = await utils.isPresent(page, '#leave-confirmation-modal')
    expect(hasConfirmModal).toBe(true)
  }, DEFAULT_E2E_TIME_OUT)
  test('should not show pop up if there was not a change in an application field', async () => {
    const { page } = await SetupBrowserAndPage(testBrowser, true)

    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    await page.waitForSelector('.tabs').then(() => page.click('.tabs li:nth-child(1)'))
    await page.waitForNavigation()

    // Verify that we're now on the application snapshot page
    expect(page.url()).toBe(`http://localhost:3000/applications/${LEASE_UP_LISTING_APPLICATION_ID}?lease_up=true`)

    await testBrowser.close()
  }, DEFAULT_E2E_TIME_OUT)
  test('should not pop up if the form was submitted successfully', async () => {
    const { browser, page } = await SetupBrowserAndPage(null, true)
    testBrowser = browser

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)

    // Change value for ada priorities, mobility impairments
    await page.click('input#form-has_ada_priorities_selected\\.mobility_impairments')

    await supplementalApplicationSteps.savePage(page)

    const isDisabled = await page.$eval('#save-supplemental-application', el => el.disabled)
    expect(isDisabled).toBeTruthy()
    // wait for full form submission
    await page.waitForSelector('#save-supplemental-application:not([disabled])')
    // Click on Original Short Form Application Tab
    await page.click('.tabs li:nth-child(1)')

    const hasConfirmModal = await utils.isPresent(page, '#leave-confirmation-modal')
    expect(hasConfirmModal).toBe(false)
  }, DEFAULT_E2E_TIME_OUT)
})
