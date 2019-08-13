import sharedSteps from '../support/puppeteer/steps/sharedSteps'
import { LEASE_UP_LISTING_ID, DEFAULT_E2E_TIME_OUT } from '../support/puppeteer/consts'
import supplementalApplicationSteps from '../support/puppeteer/steps/supplementalApplicationSteps'
import SetupBrowserAndPage from '../utils/SetupBrowserAndPage'

describe('LeaseUpPage', () => {
  test('should change "Lease Up Status" for specific application preference using dropdown in row', async () => {
    let { browser, page } = await SetupBrowserAndPage(null, true)

    await sharedSteps.loginAsAgent(page)

    await sharedSteps.goto(page, `/listings/lease-ups/${LEASE_UP_LISTING_ID}/applications`)
    await page.waitForSelector('#root')
    await page.waitForSelector('.dropdown')

    const previousStatus = await page.$eval('.rt-tr-group:first-child .rt-td .dropdown .dropdown-button', e => e.textContent)

    // Change status
    await page.click('.rt-tr-group:first-child .rt-td .dropdown')
    await page.click('.dropdown-menu li[aria-selected="false"] a:first-child')
    await page.waitForSelector('.form-modal_form_wrapper')
    const statusInModal = await page.$eval('.form-modal_form_wrapper .dropdown.status button', e => e.textContent)
    await supplementalApplicationSteps.checkForSubStatus(statusInModal, page)

    await page.type('#status-comment', 'some comment')
    await page.click('.form-modal_form_wrapper button.primary')

    // Wait for the api call
    await page.waitForResponse('http://localhost:3000/api/v1/field-update-comments/create')

    // Get changed status, it should be different
    const currentStatus = await page.$eval('.rt-tr-group:first-child .rt-td .dropdown .dropdown-button', e => e.textContent)
    expect(previousStatus).not.toBe(currentStatus)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
