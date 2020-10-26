import sharedSteps from '../support/puppeteer/steps/sharedSteps'
import {
  DEFAULT_E2E_TIME_OUT,
  FIRST_ROW_LEASE_UP_APPLICATION_ID,
  LEASE_UP_LISTING_ID
} from '../support/puppeteer/consts'
import supplementalApplicationSteps from '../support/puppeteer/steps/supplementalApplicationSteps'
import SetupBrowserAndPage from '../utils/SetupBrowserAndPage'

const firstRowDropdown = '.rt-tr-group:first-child .rt-td .dropdown .dropdown-button'
describe('LeaseUpPage', () => {
  test(
    'should change "Lease Up Status" for specific application preference using dropdown in row',
    async () => {
      const { browser, page } = await SetupBrowserAndPage(null, true)

      await sharedSteps.loginAsAgent(page)

      await sharedSteps.goto(page, `/lease-ups/listings/${LEASE_UP_LISTING_ID}`)
      await page.waitForSelector('#root')
      await page.waitForSelector('.dropdown')

      const previousStatus = await page.$eval(firstRowDropdown, (e) => e.textContent)

      // Change status
      await page.click(firstRowDropdown)
      await page.waitForSelector('li[aria-selected="false"].dropdown-menu_item  > a')
      await page.click('li[aria-selected="false"].dropdown-menu_item  > a')
      await page.waitForSelector('.form-modal_form_wrapper')

      const statusInModal = await page.$eval(
        '.form-modal_form_wrapper .status-dropdown__control button',
        (e) => e.textContent
      )
      await supplementalApplicationSteps.checkForSubStatus(statusInModal, page)

      await page.type('#status-comment', 'some comment')
      await page.click('.form-modal_form_wrapper button.primary')

      // Wait for the api call
      await page.waitForResponse(
        `http://localhost:3000/api/v1/applications/${FIRST_ROW_LEASE_UP_APPLICATION_ID}/field_update_comments`
      )

      // Get changed status, it should be different
      const currentStatus = await page.$eval(firstRowDropdown, (e) => e.textContent)
      expect(previousStatus).not.toBe(currentStatus)

      await browser.close()
    },
    DEFAULT_E2E_TIME_OUT
  )
})
