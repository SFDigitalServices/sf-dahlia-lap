import sharedSteps from '../../support/puppeteer/steps/sharedSteps'
import supplementalApplicationSteps from '../../support/puppeteer/steps/supplementalApplicationSteps'
import {
  LEASE_UP_LISTING_APPLICATION_ID,
  DEFAULT_E2E_TIME_OUT
} from '../../support/puppeteer/consts'
import SetupBrowserAndPage from '../../utils/SetupBrowserAndPage'

describe('SupplementalApplicationPage lease section', () => {
  test(
    'should allow saving of rents',
    async () => {
      const { browser, page } = await SetupBrowserAndPage()

      await sharedSteps.loginAsAgent(page)
      await sharedSteps.goto(page, `/applications/${LEASE_UP_LISTING_APPLICATION_ID}/supplementals`)
      await page.waitForSelector('button#save-supplemental-application')
      await page.click('button#edit-lease-button')

      const rentSelector = '#form-lease\\.total_monthly_rent_without_parking'
      const parkingDropdownSelector = '#form-lease\\.bmr_parking_space_assigned'
      const parkingRentSelector = '#form-lease\\.monthly_parking_rent'
      const tenantContributionSelector = '#form-lease\\.monthly_tenant_contribution'

      // Generate the values (with currency and non-currency strings)
      const rentValue = supplementalApplicationSteps.generateRandomCurrency()
      const parkingRentValue = supplementalApplicationSteps.generateRandomCurrency()
      const tenantContributionValue = supplementalApplicationSteps.generateRandomCurrency()

      // Enter them
      await sharedSteps.enterValue(page, parkingDropdownSelector, 'Yes')
      await sharedSteps.enterValue(page, rentSelector, rentValue.currency)
      await sharedSteps.enterValue(page, parkingRentSelector, parkingRentValue.currency)
      await sharedSteps.enterValue(
        page,
        tenantContributionSelector,
        tenantContributionValue.currency
      )

      // Click save
      await supplementalApplicationSteps.savePage(page)

      // Verify that the values are there (they will be returned from salesforce as numbers, not currency)
      expect(await sharedSteps.getInputValue(page, rentSelector)).toEqual(
        '$' + String(rentValue.float.toFixed(2))
      )
      expect(await sharedSteps.getInputValue(page, parkingRentSelector)).toEqual(
        '$' + String(parkingRentValue.float.toFixed(2))
      )
      expect(await sharedSteps.getInputValue(page, tenantContributionSelector)).toEqual(
        '$' + String(tenantContributionValue.float.toFixed(2))
      )

      await browser.close()
    },
    DEFAULT_E2E_TIME_OUT
  )
})
