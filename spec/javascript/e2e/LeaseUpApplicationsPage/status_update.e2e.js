import {
  DEFAULT_E2E_TIME_OUT,
  FIRST_ROW_LEASE_UP_APP_ID,
  LEASE_UP_LISTING_ID,
  SECOND_ROW_LEASE_UP_APP_ID,
  THIRD_ROW_LEASE_UP_APP_ID
} from '../../support/puppeteer/consts'
import {
  checkForStatusUpdateSuccess,
  selectStatusDropdownValue,
  fillOutAndSubmitStatusModal,
  unselectedStatusMenuItem
} from '../../support/puppeteer/steps/leaseUpStatusSteps'
import sharedSteps from '../../support/puppeteer/steps/sharedSteps'
import SetupBrowserAndPage from '../../utils/SetupBrowserAndPage'
let testBrowser

const firstRowStatusDropdown = '.rt-tr-group:first-child .rt-td .dropdown .dropdown-button'

const waitForLeaseUpAppTableToLoad = async (page) => {
  await sharedSteps.goto(page, `/lease-ups/listings/${LEASE_UP_LISTING_ID}`)
  await page.waitForSelector('#root')
  await page.waitForSelector(firstRowStatusDropdown)
}

describe('LeaseUpApplicationsPage status update', () => {
  describe('using the individual row status dropdown', () => {
    test(
      'should change status, substatus, and last updated date for the application application',
      async () => {
        const { browser, page } = await SetupBrowserAndPage(null, true)
        testBrowser = browser
        await sharedSteps.loginAsAgent(page)
        await waitForLeaseUpAppTableToLoad(page)

        // Change status to one that is not currently selected.
        const originalStatus = await sharedSteps.getText(page, firstRowStatusDropdown)
        await selectStatusDropdownValue(page, firstRowStatusDropdown, unselectedStatusMenuItem)

        // Fill out the status modal and submit.
        await fillOutAndSubmitStatusModal(page)

        // Wait for the api call
        await checkForStatusUpdateSuccess(page, FIRST_ROW_LEASE_UP_APP_ID)

        // Get changed status, it should be different
        const currentStatus = await sharedSteps.getText(page, firstRowStatusDropdown)
        expect(currentStatus).not.toBe(originalStatus)
      },
      DEFAULT_E2E_TIME_OUT
    )
  })
  describe('using the bulk update checkboxes', () => {
    const nthRowStatusDropdown = (n) =>
      `.rt-tr-group:nth-child(${n}) .rt-td .dropdown .dropdown-button`
    const bulkStatusDropdown = '.filter-row .status-dropdown__control .dropdown-button'

    const checkboxById = (appId) => `#bulk-action-checkbox-${appId}`
    const statusMenuItem = (value) => `li.is-${value.toLowerCase()} a`

    const PROCESSING = 'Processing'
    const APPEALED = 'Appealed'
    test(
      'should change the status for selected checkboxes',
      async () => {
        const { page } = await SetupBrowserAndPage(testBrowser, true)
        await waitForLeaseUpAppTableToLoad(page)

        // Check the checkboxes in the 2nd and 3rd row
        await page.click(checkboxById(SECOND_ROW_LEASE_UP_APP_ID))
        await page.click(checkboxById(THIRD_ROW_LEASE_UP_APP_ID))
        expect(
          await sharedSteps.getCheckboxVal(page, checkboxById(SECOND_ROW_LEASE_UP_APP_ID))
        ).toBe(true)
        expect(
          await sharedSteps.getCheckboxVal(page, checkboxById(THIRD_ROW_LEASE_UP_APP_ID))
        ).toBe(true)

        // Select Processing as bulk status
        await selectStatusDropdownValue(page, bulkStatusDropdown, statusMenuItem(PROCESSING))
        // Fill out the status modal and submit
        await fillOutAndSubmitStatusModal(page)

        // Wait for field update comment requests to complete and fail if they were unsuccessful.
        // The problem is that if one of these requests does not happen we get an ambiguous timeout error.
        await checkForStatusUpdateSuccess(page, SECOND_ROW_LEASE_UP_APP_ID)
        await checkForStatusUpdateSuccess(page, THIRD_ROW_LEASE_UP_APP_ID)
        // Expect checkboxes to be unchecked and statuses to be updated
        let secondRowUpdatedStatus = await sharedSteps.getText(page, nthRowStatusDropdown(2))
        expect(secondRowUpdatedStatus).toBe(PROCESSING)
        let thirdRowUpdatedStatus = await sharedSteps.getText(page, nthRowStatusDropdown(3))
        expect(thirdRowUpdatedStatus).toBe(PROCESSING)
        expect(
          await sharedSteps.getCheckboxVal(page, checkboxById(SECOND_ROW_LEASE_UP_APP_ID))
        ).toBe(false)
        expect(
          await sharedSteps.getCheckboxVal(page, checkboxById(THIRD_ROW_LEASE_UP_APP_ID))
        ).toBe(false)

        // Repeat with status Appealed
        await page.click(checkboxById(SECOND_ROW_LEASE_UP_APP_ID))
        await page.click(checkboxById(THIRD_ROW_LEASE_UP_APP_ID))

        // Select Processing as bulk status
        await selectStatusDropdownValue(page, bulkStatusDropdown, statusMenuItem(APPEALED))
        await fillOutAndSubmitStatusModal(page)
        await checkForStatusUpdateSuccess(page, SECOND_ROW_LEASE_UP_APP_ID)
        await checkForStatusUpdateSuccess(page, THIRD_ROW_LEASE_UP_APP_ID)
        // Expect checkboxes to be unchecked and statuses to be updated
        secondRowUpdatedStatus = await sharedSteps.getText(page, nthRowStatusDropdown(2))
        expect(secondRowUpdatedStatus).toBe(APPEALED)
        thirdRowUpdatedStatus = await sharedSteps.getText(page, nthRowStatusDropdown(3))
        expect(thirdRowUpdatedStatus).toBe(APPEALED)
        await testBrowser.close()
      },
      DEFAULT_E2E_TIME_OUT
    )
  })
})
