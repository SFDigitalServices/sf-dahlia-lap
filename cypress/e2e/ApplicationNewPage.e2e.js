import {
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
  HOUSEHOLD_MEMBER_DOB_YEAR
} from '../support/consts'
import { usingFixtures } from '../support/utils'

const NON_LEASE_UP_LISTING_ID = Cypress.env('NON_LEASE_UP_LISTING_ID')
const LEASE_UP_LISTING_ID = Cypress.env('LEASE_UP_LISTING_ID')
const SALE_LISTING_ID = Cypress.env('SALE_LISTING_ID')
const FCFS_RENTAL_LISTING_ID = Cypress.env('FCFS_RENTAL_LISTING_ID')

describe('ApplicationNewPage', () => {
  beforeEach(() => {
    if (usingFixtures()) {
      cy.intercept('GET', 'api/v1/short-form/**', { fixture: 'shortFormGet.json' }).as(
        'shortFormGet'
      )
      cy.intercept('POST', 'api/v1/short-form/submit', { fixture: 'shortFormPost.json' }).as(
        'shortFormPost'
      )
    } else {
      cy.intercept('GET', 'api/v1/short-form/**').as('shortFormGet')
      cy.intercept('POST', 'api/v1/short-form/submit').as('shortFormPost')
    }
  })
  it('should fail if required fields are missing, and create application if not', () => {
    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/listings/${NON_LEASE_UP_LISTING_ID}/applications/new`)

    cy.get('.save-btn').click()

    cy.contains('Please enter a First Name').should('exist')
    cy.contains('Please enter a Last Name').should('exist')
    cy.contains('Please enter a Date of Birth').should('exist')
    cy.contains('Please select a language.').should('exist')
    cy.get('.alert-box').should('exist')

    // Enter in required information
    // Type in the long strings past character limit, the test will make sure
    // the truncated version which is within the character limit gets saved
    cy.fillOutRequiredFields()

    // Select ADA priorities
    cy.get('#form-has_ada_priorities_selected\\.mobility_impairments').click()
    cy.get('#form-has_ada_priorities_selected\\.vision_impairments').click()
    cy.get('#form-has_ada_priorities_selected\\.hearing_impairments').click()

    // Save the application
    cy.get('.save-btn').click()
    cy.wait('@shortFormPost')
    cy.wait('@shortFormGet')

    // Verify that no errors are present on save
    cy.get('.alert-box').should('not.exist')

    cy.url().should('match', /\/applications\/.*\?showAddBtn=true/)

    cy.wait(5000)

    // Verify that the values match on the application view page
    cy.contains(TRUNCATED_FIRST_NAME).should('exist')
    cy.contains(TRUNCATED_LAST_NAME).should('exist')
    cy.contains(DATE_OF_BIRTH).should('exist')
    cy.contains('Vision impairments;Mobility impairments;Hearing impairments').should('exist')
  })

  it('should fail if household member is present but incomplete, and save when complete', () => {
    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/listings/${NON_LEASE_UP_LISTING_ID}/applications/new`)

    cy.fillOutRequiredFields()

    cy.get('#application_language').select('English')
    // Enter non-household member required fields
    cy.get('#first_name').type(TRUNCATED_FIRST_NAME)
    cy.get('#last_name').type(TRUNCATED_LAST_NAME)
    cy.get('#date_of_birth_month').type(DOB_MONTH)
    cy.get('#date_of_birth_day').type(DOB_DAY)
    cy.get('#date_of_birth_year').type(DOB_YEAR)

    cy.get('#add-additional-member').click()

    cy.get('#household_members_0_middle_name').type('middle name')

    cy.get('.save-btn').click()

    cy.contains('Please enter a First Name').should('exist')
    cy.contains('Please enter a Last Name').should('exist')
    cy.contains('Please enter a Date of Birth').should('exist')
    cy.get('.alert-box').should('exist')

    // Fill out required household member required fields
    cy.get('#household_members_0_first_name').type(HOUSEHOLD_MEMBER_FIRST_NAME)
    cy.get('#household_members_0_last_name').type(HOUSEHOLD_MEMBER_LAST_NAME)
    cy.get('#household_members_0_date_of_birth_month').type(HOUSEHOLD_MEMBER_DOB_MONTH)
    cy.get('#household_members_0_date_of_birth_day').type(HOUSEHOLD_MEMBER_DOB_DAY)
    cy.get('#household_members_0_date_of_birth_year').type(HOUSEHOLD_MEMBER_DOB_YEAR)

    if (usingFixtures()) {
      cy.intercept('GET', 'api/v1/short-form/**', { fixture: 'shortFormGet2.json' }).as(
        'shortFormGet'
      )
    } else {
      cy.intercept('GET', 'api/v1/short-form/**').as('shortFormGet')
    }

    // Save the application and verify there are no form errors
    cy.get('.save-btn').click()
    cy.wait('@shortFormPost')
    cy.wait('@shortFormGet')

    cy.get('.alert-box').should('not.exist')

    cy.get('.application-details')

    cy.url().should('match', /\/applications\/.*\?showAddBtn=true/)

    // We get all the application attributes values including household members
    cy.contains(TRUNCATED_FIRST_NAME).should('exist')
    cy.contains(TRUNCATED_LAST_NAME).should('exist')
    cy.contains(DATE_OF_BIRTH).should('exist')
    cy.contains(HOUSEHOLD_MEMBER_FIRST_NAME).should('exist')
    cy.contains(HOUSEHOLD_MEMBER_LAST_NAME).should('exist')
    cy.contains(HOUSEHOLD_MEMBER_DATE_OF_BIRTH).should('exist')
  })

  it('should create a new application with live/work preference successfully', () => {
    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/listings/${NON_LEASE_UP_LISTING_ID}/applications/new`)

    // Fill out primary applicant required fields
    cy.fillOutRequiredFields()

    cy.get('#add-preference-button').click()

    // Fill out live/work preference required fields
    // Select the live/work preference
    cy.get('#select-paper-preference-0').select('a0l0P00001Lx8XeQAJ') // Live/Work dropdown value

    // Verify that expected fields are required.
    cy.get('.save-btn').click()
    cy.contains('Household Member with Proof is required').should('exist')
    cy.contains('Individual Preference is required').should('exist')
    cy.contains('Type of Proof is required').should('exist')

    // Select the household member
    cy.get('#form-preferences\\.0\\.naturalKey')
      .select(`${TRUNCATED_FIRST_NAME},${TRUNCATED_LAST_NAME},${DOB_YEAR}-${DOB_MONTH}-${DOB_DAY}`)
      .blur()

    // Check ability to switch between the 2
    // options with the type of proof updating accordingly

    // Select work vs live
    cy.get('#form-preferences\\.0\\.individual_preference').select('Work in SF').blur()

    // Select type of work proof
    cy.get('#form-preferences\\.0\\.type_of_proof').select('Letter from employer').blur()

    // Select live vs work
    cy.get('#form-preferences\\.0\\.individual_preference').select('Live in SF').blur()

    // Verify that preference proof has been unset and is validated.
    cy.get('.save-btn').click()
    cy.contains('Type of Proof is required').should('exist')

    // Select type of proof
    cy.get('#form-preferences\\.0\\.type_of_proof').select('Telephone bill').blur()

    if (usingFixtures()) {
      cy.intercept('GET', 'api/v1/short-form/**', { fixture: 'shortFormGet3.json' }).as(
        'shortFormGet'
      )
    } else {
      cy.intercept('GET', 'api/v1/short-form/**').as('shortFormGet')
    }

    // Save and verify that there are no form errors
    cy.get('.save-btn').click()
    cy.wait('@shortFormPost')
    cy.wait('@shortFormGet')

    cy.get('.alert-box').should('not.exist')

    cy.get('.application-details')

    // Find the live/work table row, then check its content
    cy.get('table tr')
      .eq(1)
      .within(() => {
        cy.contains('Live or Work in San Francisco Preference')
        cy.contains(`${TRUNCATED_FIRST_NAME} ${TRUNCATED_LAST_NAME}`).should('exist')
        cy.contains('Telephone bill').should('exist')
      })
  })

  it('should validate hh member attached to preference if hh member updates', () => {
    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/listings/${NON_LEASE_UP_LISTING_ID}/applications/new`)

    cy.get('#application_language').select('English')
    // Fill out primary applicant required fields
    cy.get('#first_name').type('first name')
    cy.get('#last_name').type(TRUNCATED_LAST_NAME)
    cy.get('#date_of_birth_month').type(DOB_MONTH)
    cy.get('#date_of_birth_day').type(DOB_DAY)
    cy.get('#date_of_birth_year').type(DOB_YEAR)

    cy.get('#add-preference-button').click()

    // Fill out live/work preference required fields
    // Select the live/work preference
    cy.get('#select-paper-preference-0').select('a0l0P00001Lx8XeQAJ') // Live/Work dropdown value

    // Select the household member
    cy.get('#form-preferences\\.0\\.naturalKey').select(
      `first name,${TRUNCATED_LAST_NAME},${DOB_YEAR}-${DOB_MONTH}-${DOB_DAY}`
    )

    // Update primary applicant name and save
    cy.get('#first_name').type('forgotten character')

    cy.get('.save-btn').click()

    // Expect that a validation error is raised.
    cy.contains('This field is required').should('exist')
  })

  it('should bring up an alternate contact error message only if values are present but not first or last name', () => {
    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/listings/${NON_LEASE_UP_LISTING_ID}/applications/new`)

    // Fill out primary applicant required fields
    cy.fillOutRequiredFields()

    // Fill out one unrequired field on the alternate contact section
    cy.get('#alt_middle_name').type('A')

    cy.get('.save-btn').click()

    cy.contains('Please enter a First Name').should('exist')
    cy.contains('Please enter a Last Name').should('exist')

    // Clear alternate contact middle name
    cy.get('#alt_middle_name').type('{backspace}')

    if (usingFixtures()) {
      cy.intercept('GET', 'api/v1/short-form/**', { fixture: 'shortFormGet.json' }).as(
        'shortFormGet'
      )
    } else {
      cy.intercept('GET', 'api/v1/short-form/**').as('shortFormGet')
    }

    // Save the application and verify there are no form errors
    cy.get('.save-btn').click()
    cy.wait('@shortFormPost')
    cy.wait('@shortFormGet')

    cy.contains('.alert-box').should('not.exist')

    cy.get('.application-details').should('exist')
  })

  it('should fail for an incomplete new sale application, and create successfully when complete', () => {
    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/listings/${SALE_LISTING_ID}/applications/new`)

    cy.get('#application_language').select('English')
    cy.get('#first_name').type(FIRST_NAME)
    cy.get('#last_name').type(LAST_NAME)
    cy.get('#date_of_birth_month').type(DOB_MONTH)
    cy.get('#date_of_birth_day').type(DOB_DAY)
    cy.get('#date_of_birth_year').type(DOB_YEAR)

    cy.get('.save-btn').click()

    cy.contains('The applicant cannot qualify for the listing unless this is true.').should('exist')

    cy.get('.alert-box').should('exist')

    cy.fillOutRequiredFields()

    // eligibility section fields
    cy.get('#has_loan_preapproval').click()
    cy.get('#has_completed_homebuyer_education').click()
    cy.get('#is_first_time_homebuyer').click()
    cy.get('#lending_institution').select(1)
    cy.get('#lending_agent').select(1)

    if (usingFixtures()) {
      cy.intercept('GET', 'api/v1/short-form/**', { fixture: 'shortFormGet.json' }).as(
        'shortFormGet'
      )
    } else {
      cy.intercept('GET', 'api/v1/short-form/**').as('shortFormGet')
    }

    // Save the application and verify that there are no form errors
    cy.get('.save-btn').click()
    cy.wait('@shortFormPost')
    cy.wait('@shortFormGet')

    cy.get('.alert-box').should('not.exist')

    cy.get('.application-details')

    // Verify that the values match on the application view page
    cy.url().should('match', /\/applications\/.*\?showAddBtn=true/)

    cy.contains(TRUNCATED_FIRST_NAME).should('exist')
    cy.contains(TRUNCATED_LAST_NAME).should('exist')
    cy.contains(DATE_OF_BIRTH).should('exist')
  })

  it('should fail for an incomplete new rental fcfs application, and create successfully when complete', () => {
    cy.visit('http://localhost:3000/')
    cy.login()
    console.log(`/listings/${FCFS_RENTAL_LISTING_ID}/applications/new`)
    cy.visit(`/listings/${FCFS_RENTAL_LISTING_ID}/applications/new`)

    cy.get('#application_language').select('English')
    cy.get('#first_name').type(FIRST_NAME)
    cy.get('#last_name').type(LAST_NAME)
    cy.get('#date_of_birth_month').type(DOB_MONTH)
    cy.get('#date_of_birth_day').type(DOB_DAY)
    cy.get('#date_of_birth_year').type(DOB_YEAR)

    cy.get('.save-btn').click()

    cy.get('.alert-box').should('exist')

    cy.fillOutRequiredFields()

    if (usingFixtures()) {
      cy.intercept('GET', 'api/v1/short-form/**', { fixture: 'shortFormGet.json' }).as(
        'shortFormGet'
      )
    } else {
      cy.intercept('GET', 'api/v1/short-form/**').as('shortFormGet')
    }

    // Save the application and verify that there are no form errors
    cy.get('.save-btn').click()
    cy.wait('@shortFormPost')
    cy.wait('@shortFormGet')

    cy.get('.alert-box').should('not.exist')

    cy.get('.application-details')

    // Verify that the values match on the application view page
    cy.url().should('match', /\/applications\/.*\?showAddBtn=true/)

    cy.contains(TRUNCATED_FIRST_NAME).should('exist')
    cy.contains(TRUNCATED_LAST_NAME).should('exist')
    cy.contains(DATE_OF_BIRTH).should('exist')
  })

  // it('should redirect when lottery_status is anything other than "Not Yet Run"', () => {
  //   cy.applicationRedirectRouteCheck('new', LEASE_UP_LISTING_ID)
  // })
})
