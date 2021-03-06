import {
  NON_LEASE_UP_LISTING_ID,
  DEFAULT_E2E_TIME_OUT,
  SALE_LISTING_ID,
  LEASE_UP_LISTING_ID,
  FIRST_NAME,
  LAST_NAME,
  TRUNCATED_FIRST_NAME,
  TRUNCATED_LAST_NAME,
  DOB_MONTH,
  DOB_DAY,
  DOB_YEAR,
  DATE_OF_BIRTH,
  HOUSEHOLD_MEMBER_FIRST_NAME,
  HOUSEHOLD_MEMBER_LAST_NAME,
  HOUSEHOLD_MEMBER_DATE_OF_BIRTH,
  HOUSEHOLD_MEMBER_DOB_MONTH,
  HOUSEHOLD_MEMBER_DOB_DAY,
  HOUSEHOLD_MEMBER_DOB_YEAR,
  LENDING_INSTITUTION,
  LENDING_AGENT_ID
} from '../support/puppeteer/consts'
import { applicationRedirectRouteCheck } from '../support/puppeteer/steps/applications'
import sharedSteps from '../support/puppeteer/steps/sharedSteps'
import utils from '../support/puppeteer/utils'
import SetupBrowserAndPage from '../utils/SetupBrowserAndPage'
let testBrowser

describe('ApplicationNewPage', () => {
  test(
    'should fail if required fields are missing, and create application if not',
    async () => {
      const { browser, page } = await SetupBrowserAndPage()
      testBrowser = browser

      await sharedSteps.loginAsAgent(page)
      await sharedSteps.goto(page, `/listings/${NON_LEASE_UP_LISTING_ID}/applications/new`)

      await page.click('.save-btn')
      await page.waitForSelector('.alert-box')

      let errors = await page.$$eval('span.error', (divs) => divs.map((d) => d.textContent))
      expect(errors).toContain('Please enter a First Name')
      expect(errors).toContain('Please enter a Last Name')
      expect(errors).toContain('Please enter a Date of Birth')
      expect(errors).toContain('Please select a language.')

      const hasAlertBox = await utils.isPresent(page, '.alert-box')
      expect(hasAlertBox).toBe(true)

      // Enter in required information
      // Type in the long strings past character limit, the test will make sure
      // the truncated version which is within the character limit gets saved
      await utils.fillOutRequiredFields(page)

      // Select ADA priorities
      await page.click('#form-has_ada_priorities_selected\\.mobility_impairments')
      await page.click('#form-has_ada_priorities_selected\\.vision_impairments')
      await page.click('#form-has_ada_priorities_selected\\.hearing_impairments')

      // Save the application
      await page.click('.save-btn')
      // Verify that no errors are present on save
      errors = await page.$$eval('span.error', (divs) => divs.map((d) => d.textContent))
      expect(errors).toStrictEqual([])
      await page.waitForNavigation()
      await sharedSteps.waitForApp(page)

      await page.waitForSelector('.application-details')
      const hasApplicationDetails = await utils.isPresent(page, '.application-details')
      expect(hasApplicationDetails).toBe(true)

      // Verify that the values match on the application view page
      expect(page.url()).toMatch(/\/applications\/.*\?showAddBtn=true/)
      const values = await page.$$eval('.content-card p', (elms) => elms.map((e) => e.textContent))

      expect(values).toContain(TRUNCATED_FIRST_NAME)
      expect(values).toContain(TRUNCATED_LAST_NAME)
      expect(values).toContain(DATE_OF_BIRTH)
      expect(values).toContain('Vision impairments;Mobility impairments;Hearing impairments')
    },
    DEFAULT_E2E_TIME_OUT
  )
  test(
    'should fail if household member is present but incomplete, and save when complete',
    async () => {
      const { page } = await SetupBrowserAndPage(testBrowser)

      await sharedSteps.goto(page, `/listings/${NON_LEASE_UP_LISTING_ID}/applications/new`)
      await utils.fillOutRequiredFields(page)

      await page.select('#application_language', 'English')
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

      const errors = await sharedSteps.getFormErrors(page)
      expect(errors).toContain('Please enter a First Name')
      expect(errors).toContain('Please enter a Last Name')
      expect(errors).toContain('Please enter a Date of Birth')

      const hasAlertBox = await utils.isPresent(page, '.alert-box')
      expect(hasAlertBox).toBe(true)

      // Fill out required household member required fields
      await page.type('#household_members_0_first_name', HOUSEHOLD_MEMBER_FIRST_NAME)
      await page.type('#household_members_0_last_name', HOUSEHOLD_MEMBER_LAST_NAME)
      await page.type('#household_members_0_date_of_birth_month', HOUSEHOLD_MEMBER_DOB_MONTH)
      await page.type('#household_members_0_date_of_birth_day', HOUSEHOLD_MEMBER_DOB_DAY)
      await page.type('#household_members_0_date_of_birth_year', HOUSEHOLD_MEMBER_DOB_YEAR)

      // Save the application and verify there are no form errors
      await page.click('.save-btn')
      expect(await sharedSteps.getFormErrors(page)).toStrictEqual([])

      await page.waitForNavigation()
      await sharedSteps.waitForApp(page)

      await page.waitForSelector('.application-details')
      const hasApplicationDetails = await utils.isPresent(page, '.application-details')
      expect(hasApplicationDetails).toBe(true)

      expect(page.url()).toMatch(/\/applications\/.*\?showAddBtn=true/)

      // We get all the application attributes values including household members
      const values = await page.$$eval('.content-card p', (elms) => elms.map((e) => e.textContent))
      expect(values).toContain(TRUNCATED_FIRST_NAME)
      expect(values).toContain(TRUNCATED_LAST_NAME)
      expect(values).toContain(DATE_OF_BIRTH)
      const tableValues = await page.$$eval('.content-card table', (elms) =>
        elms.map((e) => e.textContent)
      )
      expect(tableValues[0]).toContain(HOUSEHOLD_MEMBER_FIRST_NAME)
      expect(tableValues[0]).toContain(HOUSEHOLD_MEMBER_LAST_NAME)
      expect(tableValues[0]).toContain(HOUSEHOLD_MEMBER_DATE_OF_BIRTH)
    },
    DEFAULT_E2E_TIME_OUT
  )
  test(
    'should create a new application with live/work preference successfully',
    async () => {
      const { page } = await SetupBrowserAndPage(testBrowser)

      await sharedSteps.goto(page, `/listings/${NON_LEASE_UP_LISTING_ID}/applications/new`)

      // Fill out primary applicant required fields
      await utils.fillOutRequiredFields(page)

      await page.click('#add-preference-button')

      // Fill out live/work preference required fields
      // Select the live/work preference
      const liveWorkDropdownValue = 'a0l0P00001Lx8XeQAJ'
      await page.waitForSelector('#select-paper-preference-0')
      await page.select('#select-paper-preference-0', liveWorkDropdownValue)

      // Verify that expected fields are required.
      await page.click('.save-btn')
      const errors = await sharedSteps.getFormErrors(page)
      expect(errors).toContain('Household Member with Proof is required')
      expect(errors).toContain('Individual Preference is required')
      expect(errors).toContain('Type of Proof is required')

      // Select the household member
      await page.waitForSelector('#form-preferences\\.0\\.naturalKey')
      await page.select(
        '#form-preferences\\.0\\.naturalKey',
        `${TRUNCATED_FIRST_NAME},${TRUNCATED_LAST_NAME},${DOB_YEAR}-${DOB_MONTH}-${DOB_DAY}`
      )
      await utils.blurValidation(page, '#form-preferences\\.0\\.naturalKey')

      // Check ability to switch between the 2
      // options with the type of proof updating accordingly

      // Select work vs live
      const workDropDownValue = 'Work in SF'
      await page.select('#form-preferences\\.0\\.individual_preference', workDropDownValue)
      await utils.blurValidation(page, '#form-preferences\\.0\\.individual_preference')

      // Select type of work proof
      const letterDropdownValue = 'Letter from employer'
      await page.select('#form-preferences\\.0\\.type_of_proof', letterDropdownValue)
      await utils.blurValidation(page, 'select[name="preferences.0.naturalKey"]')

      // Select live vs work
      const liveDropDownValue = 'Live in SF'
      await page.select('#form-preferences\\.0\\.individual_preference', liveDropDownValue)
      await utils.blurValidation(page, '#form-preferences\\.0\\.individual_preference')

      // Verify that preference proof has been unset and is validated.
      await page.click('.save-btn')
      const proofErrors = await sharedSteps.getFormErrors(page)
      expect(proofErrors).toContain('Type of Proof is required')

      // Select type of proof
      const telephoneBillDropdownValue = 'Telephone bill'
      await page.select('#form-preferences\\.0\\.type_of_proof', telephoneBillDropdownValue)
      await utils.blurValidation(page, 'select[name="preferences.0.naturalKey"]')

      // Save and verify that there are no form errors
      await page.click('.save-btn')
      expect(await sharedSteps.getFormErrors(page)).toStrictEqual([])

      await page.waitForNavigation()
      await sharedSteps.waitForApp(page)
      await page.waitForSelector('.application-details')

      // Find the live/work table row, then check its content
      const tableRows = await page.$$eval('#content-card-preferences table tr', (trs) =>
        trs.map((tr) => tr.textContent)
      )
      const liveWorkRow = tableRows.filter((s) =>
        s.includes('Live or Work in San Francisco Preference')
      )
      expect(liveWorkRow[0]).toContain(`${TRUNCATED_FIRST_NAME} ${TRUNCATED_LAST_NAME}`)
      expect(liveWorkRow[0]).toContain('Telephone bill')
    },
    DEFAULT_E2E_TIME_OUT
  )
  test(
    'should validate hh member attached to preference if hh member updates',
    async () => {
      const { page } = await SetupBrowserAndPage(testBrowser)

      await sharedSteps.goto(page, `/listings/${NON_LEASE_UP_LISTING_ID}/applications/new`)

      await page.select('#application_language', 'English')
      // Fill out primary applicant required fields
      await page.type('#first_name', 'first name')
      await page.type('#last_name', TRUNCATED_LAST_NAME)
      await page.type('#date_of_birth_month', DOB_MONTH)
      await page.type('#date_of_birth_day', DOB_DAY)
      await page.type('#date_of_birth_year', DOB_YEAR)

      await page.click('#add-preference-button')

      // Fill out live/work preference required fields
      // Select the live/work preference
      const liveWorkDropdownValue = 'a0l0P00001Lx8XeQAJ'
      await page.waitForSelector('#select-paper-preference-0')
      await page.select('#select-paper-preference-0', liveWorkDropdownValue)

      // Select the household member
      await page.waitForSelector('#form-preferences\\.0\\.naturalKey')
      await page.select(
        '#form-preferences\\.0\\.naturalKey',
        `first name,${TRUNCATED_LAST_NAME},${DOB_YEAR}-${DOB_MONTH}-${DOB_DAY}`
      )

      // Update primary applicant name and save
      await page.type('#first_name', 'forgotten character')
      // await page.type('#last_name', 'new last name')
      await page.click('.save-btn')

      // Expect that a validation error is raised.
      const errors = await page.$$eval('#form-preferences\\.0\\.naturalKey+span.error', (divs) =>
        divs.map((d) => d.textContent)
      )
      expect(errors).toContain('This field is required')
    },
    DEFAULT_E2E_TIME_OUT
  )
  test(
    'should bring up an alternate contact error message only if values are present but not first or last name',
    async () => {
      const { page } = await SetupBrowserAndPage(testBrowser)

      await sharedSteps.goto(page, `/listings/${NON_LEASE_UP_LISTING_ID}/applications/new`)

      // Fill out primary applicant required fields
      await utils.fillOutRequiredFields(page)

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

      // Save the application and verify there are no form errors
      await page.click('.save-btn')
      expect(await sharedSteps.getFormErrors(page)).toStrictEqual([])

      await page.waitForNavigation()
      await sharedSteps.waitForApp(page)

      await page.waitForSelector('.application-details')
      const hasApplicationDetails = await utils.isPresent(page, '.application-details')
      expect(hasApplicationDetails).toBe(true)
    },
    DEFAULT_E2E_TIME_OUT
  )
  test(
    'should fail for an incomplete new sale application, and create successfully when complete',
    async () => {
      const { page } = await SetupBrowserAndPage(testBrowser)

      await sharedSteps.goto(page, `/listings/${SALE_LISTING_ID}/applications/new`)

      await page.select('#application_language', 'English')
      await page.type('#first_name', FIRST_NAME)
      await page.type('#last_name', LAST_NAME)
      await page.type('#date_of_birth_month', DOB_MONTH)
      await page.type('#date_of_birth_day', DOB_DAY)
      await page.type('#date_of_birth_year', DOB_YEAR)

      await page.click('.save-btn')
      await page.waitForSelector('.alert-box')

      const errors = await page.$$eval('span.error', (divs) => divs.map((d) => d.textContent))
      expect(errors).toContain('The applicant cannot qualify for the listing unless this is true.')

      const hasAlertBox = await utils.isPresent(page, '.alert-box')
      expect(hasAlertBox).toBe(true)

      await utils.fillOutRequiredFields(page)

      // eligibility section fields
      await page.click('#has_loan_preapproval')
      await page.click('#has_completed_homebuyer_education')
      await page.click('#is_first_time_homebuyer')
      const selectedInstitution = await page.select('#lending_institution', LENDING_INSTITUTION)
      const selectedAgent = await page.select('#lending_agent', LENDING_AGENT_ID)
      // Verify that lending agent was selected as expected, for debugging
      expect(selectedInstitution[0]).toBe(LENDING_INSTITUTION)
      expect(selectedAgent[0]).toBe(LENDING_AGENT_ID)

      // Save the application and verify that there are no form errors
      await page.click('.save-btn')
      expect(await sharedSteps.getFormErrors(page)).toStrictEqual([])

      await page.waitForNavigation()
      await sharedSteps.waitForApp(page)

      await page.waitForSelector('.application-details')
      const hasApplicationDetails = await utils.isPresent(page, '.application-details')
      expect(hasApplicationDetails).toBe(true)

      // Verify that the values match on the application view page
      expect(page.url()).toMatch(/\/applications\/.*\?showAddBtn=true/)
      const values = await page.$$eval('.content-card p', (elms) => elms.map((e) => e.textContent))

      expect(values).toContain(TRUNCATED_FIRST_NAME)
      expect(values).toContain(TRUNCATED_LAST_NAME)
      expect(values).toContain(DATE_OF_BIRTH)
    },
    DEFAULT_E2E_TIME_OUT
  )
  test(
    'should redirect when lottery_status is anything other than "Not Yet Run"',
    async () => {
      await applicationRedirectRouteCheck('new', LEASE_UP_LISTING_ID, testBrowser)
    },
    DEFAULT_E2E_TIME_OUT
  )
})
