import {
  LEASE_UP_LISTING_APPLICATION_ID,
  DEFAULT_E2E_TIME_OUT
} from '../../support/puppeteer/consts'
import sharedSteps from '../../support/puppeteer/steps/sharedSteps'
import supplementalApplicationSteps from '../../support/puppeteer/steps/supplementalApplicationSteps'
import utils from '../../support/puppeteer/utils'
import SetupBrowserAndPage from '../../utils/SetupBrowserAndPage'
let testBrowser

describe('SupplementalApplicationPage confirm modal', () => {
  test(
    'should pop up if there was a change in an application field',
    async () => {
      const { browser, page } = await SetupBrowserAndPage(null, true)
      testBrowser = browser

      await sharedSteps.loginAsAgent(page)
      await sharedSteps.goto(
        page,
        `/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplemental`
      )
      await page.waitForSelector('button#save-supplemental-application')

      // Change value for ada priorities, mobility impairments
      await page.click('input#form-has_ada_priorities_selected\\.mobility_impairments')

      // Click on Original Short Form Application Tab
      await page.click('.tabs li:nth-child(1)')

      const hasConfirmModal = await utils.isPresent(page, '#leave-confirmation-modal')
      expect(hasConfirmModal).toBe(true)
    },
    DEFAULT_E2E_TIME_OUT
  )
  test(
    'should not show pop up if there was not a change in an application field',
    async () => {
      const { page } = await SetupBrowserAndPage(testBrowser, true)

      await sharedSteps.goto(
        page,
        `/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplemental`
      )
      await page.waitForSelector('button#save-supplemental-application')

      const url = await page.waitForSelector('.tabs').then(async () => {
        await page.click('.tabs li:nth-child(1)')
        return page.url()
      })

      // Verify that we're now on the application snapshot page
      expect(url).toBe(
        `http://localhost:3000/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`
      )

      await testBrowser.close()
    },
    DEFAULT_E2E_TIME_OUT
  )
  test(
    'should not pop up if the form was submitted successfully',
    async () => {
      const { browser, page } = await SetupBrowserAndPage(null, true)
      testBrowser = browser

      await sharedSteps.loginAsAgent(page)
      await sharedSteps.goto(
        page,
        `/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplemental`
      )
      await page.waitForSelector('button#save-supplemental-application')

      // Change value for ada priorities, mobility impairments
      await page.click('input#form-has_ada_priorities_selected\\.mobility_impairments')

      await supplementalApplicationSteps.savePage(page)

      const isDisabled = await page.$eval('#save-supplemental-application', (el) => el.disabled)
      expect(isDisabled).toBeTruthy()
      // wait for full form submission
      await page.waitForSelector('#save-supplemental-application:not([disabled])')
      // Click on Original Short Form Application Tab
      await page.click('.tabs li:nth-child(1)')

      const hasConfirmModal = await utils.isPresent(page, '#leave-confirmation-modal')
      expect(hasConfirmModal).toBe(false)
    },
    DEFAULT_E2E_TIME_OUT
  )
})
