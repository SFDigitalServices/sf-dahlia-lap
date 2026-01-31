// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { FIRST_NAME, LAST_NAME, DOB_MONTH, DOB_DAY, DOB_YEAR, DECLINE_TO_STATE } from './consts'
import { usingFixtures } from './utils'

import '@testing-library/cypress/add-commands'

const commentInputSelector = '#status-comment'
const submitStatusModalSelector = '.form-modal_form_wrapper button.primary'
const unselectedStatusMenuItem = 'li[aria-selected="false"].dropdown-menu_item > a'

Cypress.Commands.add('setupIntercepts', () => {
  if (usingFixtures()) {
    cy.intercept('api/v1/short-form/**', { fixture: 'shortForm.json' }).as('shortForm')
    cy.intercept('api/v1/applications/**/field_update_comments', {
      fixture: 'fieldUpdateComments.json'
    }).as('fieldUpdateComments')
    cy.intercept('api/v1/applications/**/leases', { fixture: 'leases.json' }).as('leases')
    cy.intercept('api/v1/rental-assistances?application_id=**', {
      fixture: 'rentalAssistances.json'
    }).as('rentalAssistances')
    cy.intercept('api/v1/supplementals/**', { fixture: 'supplementals.json' }).as('supplementals')
    cy.intercept('api/v1/supplementals/units?listing_id=**', { fixture: 'units.json' }).as('units')
    cy.intercept('api/v1/lease-ups/listings/**', { fixture: 'leaseUpListing.json' }).as(
      'leaseUpListing'
    )
    cy.intercept('api/v1/applications/**/leases/**', { fixture: 'lease.json' }).as('lease')
  } else {
    cy.intercept('api/v1/short-form/**').as('shortForm')
    cy.intercept('api/v1/applications/**/field_update_comments').as('fieldUpdateComments')
    cy.intercept('api/v1/applications/**/leases').as('leases')
    cy.intercept('api/v1/rental-assistances?application_id=**').as('rentalAssistances')
    cy.intercept('api/v1/supplementals/**').as('supplementals')
    cy.intercept('api/v1/supplementals/units?listing_id=**').as('units')
    cy.intercept('api/v1/lease-ups/listings/**').as('leaseUpListing')
    cy.intercept('api/v1/applications/**/leases/**').as('lease')
  }
})

Cypress.Commands.add('login', () => {
  if (usingFixtures()) {
    cy.intercept('api/v1/lease-ups/listings', { fixture: 'listings.json' }).as('listings')
  } else {
    cy.intercept('api/v1/lease-ups/listings').as('listings')
  }

  cy.get('.sign-in-btn').click()

  // This catches the pesky cross-origin error that happens on login
  cy.on('uncaught:exception', (e) => {
    // we expected this error, so let's ignore it
    // and let the test continue
    return false
  })
  cy.origin(Cypress.env('COMMUNITY_LOGIN_URL'), () => {
    // This catches the pesky cross-origin error that happens on login
    cy.on('uncaught:exception', (e) => {
      // we expected this error, so let's ignore it
      // and let the test continue
      return false
    })
    cy.get('#username_container', { timeout: 10000 }).should('be.visible')
    cy.get('#username').click().type(Cypress.env('SALESFORCE_USERNAME'))
    cy.get('#password', { log: Cypress.env('LOG_SECRETS') })
      .click({ log: Cypress.env('LOG_SECRETS') })
      .type(Cypress.env('SALESFORCE_PASSWORD'), { log: Cypress.env('LOG_SECRETS') })
    cy.get('#Login', { log: Cypress.env('LOG_SECRETS') }).click({ log: Cypress.env('LOG_SECRETS') })
  })

  cy.wait('@listings')

  cy.get('.lead-header_title').contains('Lease Ups')
})

Cypress.Commands.add('fillOutRequiredFields', () => {
  cy.get('#application_language').select('English')
  cy.get('#first_name').type(FIRST_NAME)
  cy.get('#last_name').type(LAST_NAME)
  cy.get('#date_of_birth_month').type(DOB_MONTH)
  cy.get('#date_of_birth_day').type(DOB_DAY)
  cy.get('#date_of_birth_year').type(DOB_YEAR)

  // Demographics section fields
  cy.get('select[name="demographics.ethnicity"]').select(DECLINE_TO_STATE)
  cy.get('select[name="demographics.race"]').select(DECLINE_TO_STATE)
  cy.get('select[name="demographics.gender"]').select(DECLINE_TO_STATE)
  cy.get('select[name="demographics.sexual_orientation"]').select(DECLINE_TO_STATE)

  // Signature on Terms of Agreement
  cy.get('input[name="terms_acknowledged"]').click()
})

Cypress.Commands.add('applicationRedirectRouteCheck', (type, id) => {
  cy.visit('http://localhost:3000/')
  cy.login()

  const fullURL = type === 'new' ? `/listings/${id}/applications/new` : `/applications/${id}/edit`
  const resultURL = type === 'new' ? `listings/${id}` : `applications/${id}`

  if (type !== 'new') {
    if (usingFixtures()) {
      cy.intercept('api/v1/short-form/**', { fixture: 'shortForm.json' }).as('shortForm')
    } else {
      cy.intercept('api/v1/short-form/**').as('shortForm')
    }
  }

  cy.visit(fullURL)
  if (type !== 'new') {
    cy.wait('@shortForm')
  }

  cy.url().should('contain', resultURL)
  cy.url().should('not.contain', type)
})

Cypress.Commands.add('selectStatusDropdownValue', (dropdownSelector, valueSelector) => {
  cy.get(dropdownSelector, { timeout: 10000 }).should('be.visible').and('not.be.disabled').click()
  cy.get(valueSelector, { timeout: 5000 }).should('be.visible').first().click()
})

Cypress.Commands.add('checkForStatusUpdateSuccess', () => {
  if (usingFixtures()) {
    cy.intercept('POST', 'api/v1/applications/**/field_update_comments', {
      fixture: 'fieldUpdateCommentsPost.json'
    }).as('fieldUpdateComments')
  } else {
    cy.intercept('POST', 'api/v1/applications/**/field_update_comments', (req) => {
      req.continue((res) => {
        if (res.statusCode !== 200) {
          console.error('Status update failure response: ', res.body)
        }
      })
    }).as('fieldUpdateComments')
  }
})

Cypress.Commands.add('getText', (selector) => {
  return cy.get(selector).invoke('text')
})

Cypress.Commands.add('getStatusInModal', () => {
  return cy.getText('.form-modal_form_wrapper .status-dropdown__control button')
})

Cypress.Commands.add('fillOutAndSubmitStatusModal', (isCommentModal = false) => {
  // Wait for modal to be visible
  cy.get('.form-modal_form_wrapper', { timeout: 10000 }).should('be.visible')

  if (!isCommentModal) {
    cy.getStatusInModal().then((status) => {
      cy.selectSubstatusIfRequired(status)
    })
  }
  cy.get(commentInputSelector, { timeout: 5000 }).should('be.visible').clear().type('some comment')
  cy.get(submitStatusModalSelector, { timeout: 5000 })
    .should('be.visible')
    .and('not.be.disabled')
    .click()
})

Cypress.Commands.add('selectSubstatusIfRequired', (selectedStatus) => {
  if (selectedStatus.toLowerCase() !== 'lease signed') {
    // If status has a subStatus value wait for that dropdown to be available and select one
    cy.get('.form-modal_form_wrapper .substatus-dropdown__control', { timeout: 5000 })
      .should('be.visible')
      .click()

    cy.get('.form-modal_form_wrapper .substatus-dropdown__control button', { timeout: 5000 })
      .invoke('text')
      .should('contain', 'Select one...')

    cy.get('.form-modal_form_wrapper .substatus-dropdown__menu li a', { timeout: 5000 })
      .should('be.visible')
      .first()
      .click()

    let selectedSubStatus
    cy.getStatusInModal().then((status) => {
      selectedSubStatus = status
      cy.wrap(selectedSubStatus.toLowerCase()).should('not.include', 'select one...')
    })

    return selectedSubStatus
  }
})

Cypress.Commands.add('getInputValue', (selector) => cy.get(selector).invoke('val'))

Cypress.Commands.add('saveSupplementalApplication', () => {
  if (usingFixtures()) {
    cy.intercept('api/v1/short-form/submit?supplemental=true', {
      fixture: 'shortFormSubmit.json'
    }).as('saveRequest')
  } else {
    cy.intercept('**/api/v1/short-form/submit?supplemental=true').as('saveRequest')
  }

  // Click save
  cy.get('#save-supplemental-application').click()

  cy.wait('@saveRequest')
})

Cypress.Commands.add('testStatusModalUpdate', () => {
  const COMMENT = 'This is a comment.'
  const unselectedStatusSelector = '.form-modal_form_wrapper ' + unselectedStatusMenuItem
  let newSelectedStatus

  // Ensure modal is fully visible and ready
  cy.get('.form-modal_form_wrapper', { timeout: 10000 }).should('be.visible')

  // Select a status different from the current one in the status modal
  cy.get('.form-modal_form_wrapper .dropdown', { timeout: 5000 })
    .first()
    .should('be.visible')
    .click()

  // Wait for dropdown menu to appear
  cy.get(unselectedStatusSelector, { timeout: 5000 }).should('be.visible')

  cy.get(unselectedStatusSelector)
    .first()
    .invoke('text')
    .then((text) => {
      newSelectedStatus = text.trim()
      cy.get(unselectedStatusSelector).first().click()
      cy.selectSubstatusIfRequired(newSelectedStatus)
    })

  // Enter a comment into the status modal comment field
  cy.get(commentInputSelector, { timeout: 5000 }).should('be.visible').clear().type(COMMENT)

  // Submit the status modal form
  cy.get(submitStatusModalSelector, { timeout: 5000 }).should('be.visible').and('not.be.disabled').click()

  // Verify that no form-field errors are present on save
  cy.get('span.error').should('not.exist')

  // Wait for modal overlay to be hidden after submit with increased timeout
  cy.get('.ReactModal__Overlay.ReactModal__Overlay--after-open', { timeout: 30000 }).should('not.exist')

  // Wait a bit for the UI to update after modal closes
  cy.wait(500)

  // The latest status in the status history should be the status that was just selected and saved
  cy.get('.status-items .status-item:first-child .status-pill', { timeout: 10000 })
    .should('be.visible')
    .invoke('text')
    .then((latestStatus) => {
      cy.wrap(latestStatus.trim()).should('equal', newSelectedStatus)
    })

  // The latest comment in the status history should be the comment that was just entered and saved
  cy.get('.status-items .status-item:first-child .status-item-text', { timeout: 5000 })
    .should('be.visible')
    .invoke('text')
    .then((latestComment) => {
      cy.wrap(latestComment.trim()).should('equal', COMMENT)
    })
})

//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
