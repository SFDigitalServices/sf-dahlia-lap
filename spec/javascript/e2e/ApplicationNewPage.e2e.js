import puppeteer from 'puppeteer'

import utils from '../support/puppeteer/utils'
import steps from '../support/puppeteer/steps'
import { LEASE_UP_LISTING_ID } from '../support/puppeteer/consts'

describe('ApplicationNewPage', () => {
  test('should create a new application', async () => {
    let browser = await puppeteer.launch({ headless: true })
    let page = await browser.newPage()

    await steps.loginAsAgent(page)
    await steps.goto(page, `/listings/${LEASE_UP_LISTING_ID}/applications/new`)

    await page.type('#first_name', 'Some first name')
    await page.type('#last_name', 'Some last name')
    await page.type('#date_of_birth', '03/03/1983')
    await page.click('.save-btn')
    await page.waitForNavigation()
    await steps.waitForApp(page)

    const hasApplicationDetails = await utils.isPresent(page, '.application-details')
    expect(hasApplicationDetails).toBe(true)

    expect(page.url()).toMatch(/\/applications\/.*\?showAddBtn=true/)

    browser.close()
  }, 260000)

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
  }, 100000)
})
