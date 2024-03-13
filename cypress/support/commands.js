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

Cypress.Commands.add('login', () => {
  if (usingFixtures) {
    cy.intercept('api/v1/lease-ups/listings', { fixture: 'listings.json' }).as('listings')
  }

  cy.get('.sign-in-btn').click()

  cy.origin(Cypress.env('COMMUNITY_LOGIN_URL'), () => {
    cy.get('#username_container', { timeout: 10000 }).should('be.visible')
    cy.get('#username').click().type(Cypress.env('SALESFORCE_USERNAME'))
    cy.get('#password', { log: Cypress.env('LOG_SECRETS') })
      .click({ log: Cypress.env('LOG_SECRETS') })
      .type(Cypress.env('SALESFORCE_PASSWORD'), { log: Cypress.env('LOG_SECRETS') })
    cy.get('#Login', { log: Cypress.env('LOG_SECRETS') }).click({ log: Cypress.env('LOG_SECRETS') })
  })

  if (usingFixtures) {
    cy.wait('@listings')
  }

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
  cy.get(dropdownSelector).click()
  cy.get(valueSelector).first().click()
})

Cypress.Commands.add('checkForStatusUpdateSuccess', () => {
  if (usingFixtures) {
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
  if (!isCommentModal) {
    cy.getStatusInModal().then((status) => {
      cy.selectSubstatusIfRequired(status)
    })
  }
  cy.get(commentInputSelector).type('some comment')
  cy.get(submitStatusModalSelector).click()
})

Cypress.Commands.add('selectSubstatusIfRequired', (selectedStatus) => {
  if (
    selectedStatus.toLowerCase() !== 'processing' &&
    selectedStatus.toLowerCase() !== 'lease signed'
  ) {
    // If status has a subStatus value wait for that dropdown to be available and select one
    cy.get('.form-modal_form_wrapper .substatus-dropdown__control').click()

    cy.get('.form-modal_form_wrapper .substatus-dropdown__control button')
      .invoke('text')
      .should('contain', 'Select one...')

    cy.get('.form-modal_form_wrapper .substatus-dropdown__menu li a').first().click()

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
  if (usingFixtures) {
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

  // Select a status different from the current one in the status modal
  cy.get('.form-modal_form_wrapper .dropdown').first().click()
  cy.get(unselectedStatusSelector)
    .first()
    .invoke('text')
    .then((text) => {
      newSelectedStatus = text
      cy.get(unselectedStatusSelector).first().click()
      cy.selectSubstatusIfRequired(newSelectedStatus)
    })

  // Enter a comment into the status modal comment field
  cy.get(commentInputSelector).type(COMMENT)

  // Submit the status modal form
  cy.get(submitStatusModalSelector).click()

  // Verify that no form-field errors are present on save
  cy.get('span.error').should('not.exist')

  // Verify that the response from salesforce was a success
  cy.checkForStatusUpdateSuccess()

  // wait for modal overlay to be hidden after submit
  cy.get('.ReactModal__Overlay.ReactModal__Overlay--after-open').should('not.exist')

  // The latest status in the status history should be the status that was just selected and saved
  cy.getText('.status-items .status-item:first-child .status-pill').then((latestStatus) => {
    cy.wrap(latestStatus).should('equal', newSelectedStatus)
  })

  // The latest comment in the status history should be the comment that was just entered and saved
  cy.getText('.status-items .status-item:first-child .status-item-text').then((latestComment) => {
    cy.wrap(latestComment).should('equal', COMMENT)
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
