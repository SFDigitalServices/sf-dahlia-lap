import puppeteer from 'puppeteer'

import utils from '../support/puppeteer/utils'
import steps from '../support/puppeteer/steps'
import { LEASE_UP_LISTING_ID, DEFAULT_E2E_TIME_OUT } from '../support/puppeteer/consts'

describe('ApplicationNewPage', () => {
  test('should create a new application', async () => {
    const FIRST_NAME = 'Some first name'
    const LAST_NAME = 'Some last name'
    const DATE_OF_BIRTH = '03/03/1983'

    let browser = await puppeteer.launch({ headless: true })
    let page = await browser.newPage()

    await steps.loginAsAgent(page)
    await steps.goto(page, `/listings/${LEASE_UP_LISTING_ID}/applications/new`)

    await page.type('#first_name', FIRST_NAME)
    await page.type('#last_name', LAST_NAME)
    await page.type('#date_of_birth', DATE_OF_BIRTH)
    await page.click('.save-btn')
    await page.waitForNavigation()
    await steps.waitForApp(page)

    const hasApplicationDetails = await utils.isPresent(page, '.application-details')
    expect(hasApplicationDetails).toBe(true)

    expect(page.url()).toMatch(/\/applications\/.*\?showAddBtn=true/)

    // We get all the application attributes values
    const values = await page.$$eval('.content-card p', elms => elms.map(e => e.textContent))
    expect(values).toContain(FIRST_NAME)
    expect(values).toContain(LAST_NAME)
    expect(values).toContain(DATE_OF_BIRTH)

    browser.close()
  }, DEFAULT_E2E_TIME_OUT)

  test('should fail if required fields are missing', async () => {
    let browser = await puppeteer.launch({ headless: true })
    let page = await browser.newPage()

    await steps.loginAsAgent(page)
    await steps.goto(page, `/listings/${LEASE_UP_LISTING_ID}/applications/new`)

    await page.click('.save-btn')
    await page.waitForSelector('.alert-box')

    const errors = await page.$$eval('.form-group.error span.error', divs => divs.map(d => d.textContent))
    expect(errors).toContain('Please enter a First Name')
    expect(errors).toContain('Please enter a Last Name')
    expect(errors).toContain('Please enter a valid Date of Birth')

    const hasAlertBox = await utils.isPresent(page, '.alert-box')
    expect(hasAlertBox).toBe(true)

    browser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
