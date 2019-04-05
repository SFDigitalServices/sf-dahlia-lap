import puppeteer from 'puppeteer'

import utils from '../support/puppeteer/utils'
import sharedSteps from '../support/puppeteer/steps/sharedSteps'
import { NON_LEASE_UP_LISTING_ID, DEFAULT_E2E_TIME_OUT, HEADLESS } from '../support/puppeteer/consts'

describe('ApplicationNewPage', () => {
  const FIRST_NAME = 'VERY_LONG_FIRST_NAME_THAT_IS_EXACTLY_40!NOWOVER'
  const LAST_NAME = 'VERY_LONG_LAST_NAME_THAT_IS_EXACTLY_40!!NOWOVER'

  const TRUNCATED_FIRST_NAME = 'VERY_LONG_FIRST_NAME_THAT_IS_EXACTLY_40!'
  const TRUNCATED_LAST_NAME = 'VERY_LONG_LAST_NAME_THAT_IS_EXACTLY_40!!'
  const DOB_MONTH = '03'
  const DOB_DAY = '04'
  const DOB_YEAR = '1983'
  const DATE_OF_BIRTH = '03/04/1983'

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
    // Type in the long strings past character limit, the test will make sure
    // the truncated version which is within the character limit gets saved
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

    expect(values).toContain(TRUNCATED_FIRST_NAME)
    expect(values).toContain(TRUNCATED_LAST_NAME)
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
    expect(errors).toContain('Please enter a Date of Birth')

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
    await page.type('#first_name', TRUNCATED_FIRST_NAME)
    await page.type('#last_name', TRUNCATED_LAST_NAME)
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
    expect(values).toContain(TRUNCATED_FIRST_NAME)
    expect(values).toContain(TRUNCATED_LAST_NAME)
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
    await page.type('#first_name', TRUNCATED_FIRST_NAME)
    await page.type('#last_name', TRUNCATED_LAST_NAME)
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
    expect(errors).toContain('Please enter a Date of Birth')

    const hasAlertBox = await utils.isPresent(page, '.alert-box')
    expect(hasAlertBox).toBe(true)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)

  test('should create a new application with live/work preference successfully', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/listings/${NON_LEASE_UP_LISTING_ID}/applications/new`)

    // Fill out primary applicant required fields
    await page.type('#first_name', TRUNCATED_FIRST_NAME)
    await page.type('#last_name', TRUNCATED_LAST_NAME)
    await page.type('#date_of_birth_month', DOB_MONTH)
    await page.type('#date_of_birth_day', DOB_DAY)
    await page.type('#date_of_birth_year', DOB_YEAR)

    await page.click('#add-preference-button')

    // Fill out live/work preference required fields
    // Select the live/work preference
    const liveWorkDropdownValue = '5'
    await page.waitForSelector('#select-paper-preference-0')
    await page.select('#select-paper-preference-0', liveWorkDropdownValue)

    // Select the household member
    await page.waitForSelector('#preferences\\.0\\.naturalKey')
    await page.select('#preferences\\.0\\.naturalKey', '1')

    // Select live vs work
    const liveDropDownValue = '1'
    await page.select('#preferences\\.0\\.individual_preference', liveDropDownValue)

    // Select type of proof
    const telephoneBillDropdownValue = '1'
    await page.select('#preferences\\.0\\.type_of_proof', telephoneBillDropdownValue)

    await page.click('.save-btn')
    await page.waitForNavigation()
    await sharedSteps.waitForApp(page)

    // Find the live/work table row, then check its content
    const tableRows = await page.$$eval('#content-card-preferences table tr', trs => trs.map((tr) => tr.textContent))
    const liveWorkRow = tableRows.filter(s => s.includes('Live or Work in San Francisco Preference'))
    expect(liveWorkRow[0]).toContain(`${TRUNCATED_FIRST_NAME} ${TRUNCATED_LAST_NAME}`)
    expect(liveWorkRow[0]).toContain('Telephone bill')

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)

  test('should bring up an alternate contact error message only if values are present but not first or last name', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/listings/${NON_LEASE_UP_LISTING_ID}/applications/new`)

    // Fill out primary applicant required fields
    await page.type('#first_name', TRUNCATED_FIRST_NAME)
    await page.type('#last_name', TRUNCATED_LAST_NAME)
    await page.type('#date_of_birth_month', DOB_MONTH)
    await page.type('#date_of_birth_day', DOB_DAY)
    await page.type('#date_of_birth_year', DOB_YEAR)

    // Fill out one unrequired field on the alternate contact section
    await page.type('#alt_middle_name', 'A')

    await page.click('.save-btn')

    const hasAltFirstNameError = await utils.isPresent(page, '#alt_first_name.error')
    const hasAltLastNameError = await utils.isPresent(page, '#alt_last_name.error')
    expect(hasAltFirstNameError).toBe(true)
    expect(hasAltLastNameError).toBe(true)

    // Clear alternate contact middle name
    await page.focus('#alt_middle_name')
    await page.keyboard.press('Backspace')

    // Save the application
    await page.click('.save-btn')
    await page.waitForNavigation()
    await sharedSteps.waitForApp(page)

    const hasApplicationDetails = await utils.isPresent(page, '.application-details')
    expect(hasApplicationDetails).toBe(true)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
