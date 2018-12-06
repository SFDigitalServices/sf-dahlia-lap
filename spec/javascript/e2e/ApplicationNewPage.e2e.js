import puppeteer from 'puppeteer'

import utils from '../support/puppeteer/utils'
import sharedSteps from '../support/puppeteer/steps/sharedSteps'
import { NON_LEASE_UP_LISTING_ID, DEFAULT_E2E_TIME_OUT, HEADLESS } from '../support/puppeteer/consts'

describe('ApplicationNewPage', () => {
  const FIRST_NAME = 'Some first name'
  const LAST_NAME = 'Some last name'
  const DATE_OF_BIRTH = '03/04/1983'
  const DOB_MONTH = '03'
  const DOB_DAY = '04'
  const DOB_YEAR = '1983'

  const HOUSEHOLD_MEMBER_FIRST_NAME = 'HM first name'
  const HOUSEHOLD_MEMBER_LAST_NAME = 'HM last name'
  const HOUSEHOLD_MEMBER_DATE_OF_BIRTH = '01/12/1980'
  const HOUSEHOLD_MEMBER_DOB_MONTH = '1'
  const HOUSEHOLD_MEMBER_DOB_DAY = '12'
  const HOUSEHOLD_MEMBER_DOB_YEAR = '1980'

  test('should create a new application successfully', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/listings/${NON_LEASE_UP_LISTING_ID}/applications/new`)

    // Enter in required information
    await page.type('#first_name', FIRST_NAME)
    await page.type('#last_name', LAST_NAME)
    await page.type('#date_of_birth_month', DOB_MONTH)
    await page.type('#date_of_birth_day', DOB_DAY)
    await page.type('#date_of_birth_year', DOB_YEAR)

    // Select ADA priorities
    await page.click('#adaPrioritiesSelected-0')
    await page.click('#adaPrioritiesSelected-1')
    await page.click('#adaPrioritiesSelected-2')

    // Save the application
    await page.click('.save-btn')
    await page.waitForNavigation()
    await sharedSteps.waitForApp(page)

    const hasApplicationDetails = await utils.isPresent(page, '.application-details')
    expect(hasApplicationDetails).toBe(true)

    // Verify that the values match on the application view page
    expect(page.url()).toMatch(/\/applications\/.*\?showAddBtn=true/)
    const values = await page.$$eval('.content-card p', elms => elms.map(e => e.textContent))

    expect(values).toContain(FIRST_NAME)
    expect(values).toContain(LAST_NAME)
    expect(values).toContain(DATE_OF_BIRTH)
    expect(values).toContain('Vision impairments;Mobility impairments;Hearing impairments')

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)

  test('should fail if required fields are missing', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/listings/${NON_LEASE_UP_LISTING_ID}/applications/new`)

    await page.click('.save-btn')
    await page.waitForSelector('.alert-box')

    const errors = await page.$$eval('.form-group.error span.error', divs => divs.map(d => d.textContent))
    expect(errors).toContain('Please enter a First Name')
    expect(errors).toContain('Please enter a Last Name')
    expect(errors).toContain('Please enter a valid Date of Birth')

    const hasAlertBox = await utils.isPresent(page, '.alert-box')
    expect(hasAlertBox).toBe(true)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)

  test('should create a new application with household member successfully', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/listings/${NON_LEASE_UP_LISTING_ID}/applications/new`)

    // Fill out primary applicant required fields
    await page.type('#first_name', FIRST_NAME)
    await page.type('#last_name', LAST_NAME)
    await page.type('#date_of_birth_month', DOB_MONTH)
    await page.type('#date_of_birth_day', DOB_DAY)
    await page.type('#date_of_birth_year', DOB_YEAR)

    await page.click('#add-additional-member')
    // Fill out household member required fields
    await page.type('#household_members_0_first_name', HOUSEHOLD_MEMBER_FIRST_NAME)
    await page.type('#household_members_0_last_name', HOUSEHOLD_MEMBER_LAST_NAME)
    await page.type('#household_members_0_date_of_birth_month', HOUSEHOLD_MEMBER_DOB_MONTH)
    await page.type('#household_members_0_date_of_birth_day', HOUSEHOLD_MEMBER_DOB_DAY)
    await page.type('#household_members_0_date_of_birth_year', HOUSEHOLD_MEMBER_DOB_YEAR)

    await page.click('.save-btn')
    await page.waitForNavigation()
    await sharedSteps.waitForApp(page)

    const hasApplicationDetails = await utils.isPresent(page, '.application-details')
    expect(hasApplicationDetails).toBe(true)

    expect(page.url()).toMatch(/\/applications\/.*\?showAddBtn=true/)

    // We get all the application attributes values
    const values = await page.$$eval('.content-card p', elms => elms.map(e => e.textContent))
    expect(values).toContain(FIRST_NAME)
    expect(values).toContain(LAST_NAME)
    expect(values).toContain(DATE_OF_BIRTH)
    const tableValues = await page.$$eval('.content-card table', elms => elms.map(e => e.textContent))
    expect(tableValues[0]).toContain(HOUSEHOLD_MEMBER_FIRST_NAME)
    expect(tableValues[0]).toContain(HOUSEHOLD_MEMBER_LAST_NAME)
    expect(tableValues[0]).toContain(HOUSEHOLD_MEMBER_DATE_OF_BIRTH)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)

  test('should fail if household member is present but incomplete', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/listings/${NON_LEASE_UP_LISTING_ID}/applications/new`)

    // Enter non-household member required fields
    await page.type('#first_name', FIRST_NAME)
    await page.type('#last_name', LAST_NAME)
    await page.type('#date_of_birth_month', DOB_MONTH)
    await page.type('#date_of_birth_day', DOB_DAY)
    await page.type('#date_of_birth_year', DOB_YEAR)

    await page.click('#add-additional-member')
    await page.type('#household_members_0_middle_name', 'middle name')

    await page.click('.save-btn')
    await page.waitForSelector('.alert-box')

    const errors = await page.$$eval('.form-group.error span.error', divs => divs.map(d => d.textContent))
    expect(errors).toContain('Please enter a First Name')
    expect(errors).toContain('Please enter a Last Name')
    expect(errors).toContain('Please enter a valid Date of Birth')

    const hasAlertBox = await utils.isPresent(page, '.alert-box')
    expect(hasAlertBox).toBe(true)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
