import { usingFixtures } from '../../support/utils'

const LEASE_UP_LISTING_APPLICATION_ID = Cypress.env('LEASE_UP_LISTING_APPLICATION_ID')
const unselectedStatusMenuItem = 'li[aria-selected="false"].dropdown-menu_item > a'

describe('SupplementalApplicationPage statuses', () => {
  beforeEach(() => {
    // Set up all intercepts before any navigation
    if (usingFixtures()) {
      cy.intercept('api/v1/short-form/**', { fixture: 'shortForm.json' }).as('shortForm')
      cy.intercept('GET', 'api/v1/applications/**/field_update_comments', {
        fixture: 'fieldUpdateComments.json'
      }).as('fieldUpdateCommentsGet')
      cy.intercept('POST', 'api/v1/applications/**/field_update_comments', {
        fixture: 'fieldUpdateCommentsPost.json'
      }).as('fieldUpdateCommentsPost')
      cy.intercept('api/v1/applications/**/leases', { fixture: 'leases.json' }).as('leases')
      cy.intercept('api/v1/rental-assistances?application_id=**', {
        fixture: 'rentalAssistances.json'
      }).as('rentalAssistances')
      cy.intercept('api/v1/supplementals/**', { fixture: 'supplementals.json' }).as('supplementals')
      cy.intercept('api/v1/supplementals/units?listing_id=**', { fixture: 'units.json' }).as(
        'units'
      )
      cy.intercept('api/v1/lease-ups/listings/**', { fixture: 'leaseUpListing.json' }).as(
        'leaseUpListing'
      )
    } else {
      cy.intercept('api/v1/short-form/**').as('shortForm')
      cy.intercept('GET', 'api/v1/applications/**/field_update_comments').as(
        'fieldUpdateCommentsGet'
      )
      cy.intercept('POST', 'api/v1/applications/**/field_update_comments').as(
        'fieldUpdateCommentsPost'
      )
      cy.intercept('api/v1/applications/**/leases').as('leases')
      cy.intercept('api/v1/rental-assistances?application_id=**').as('rentalAssistances')
      cy.intercept('api/v1/supplementals/**').as('supplementals')
      cy.intercept('api/v1/supplementals/units?listing_id=**').as('units')
      cy.intercept('api/v1/lease-ups/listings/**').as('leaseUpListing')
    }
  })

  it('should allow status updates via the Add a Comment button in the status history section', () => {
    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)
    
    // Wait for all initial data to load
    cy.wait('@shortForm')
    cy.wait('@fieldUpdateCommentsGet')
    cy.wait('@leases')
    cy.wait('@rentalAssistances')
    cy.wait('@supplementals')
    cy.wait('@units')
    cy.wait('@leaseUpListing')

    // Ensure the page is fully rendered before interacting
    cy.get('#add-status-history-comment', { timeout: 10000 }).should('be.visible')
    
    // Click on the "Add a Comment" button in the Status History sidebar
    cy.get('#add-status-history-comment').click()

    // Wait for modal to be visible
    cy.get('.form-modal_form_wrapper', { timeout: 10000 }).should('be.visible')

    cy.testStatusModalUpdate()
    cy.wait('@fieldUpdateCommentsPost', { timeout: 15000 })
  })

  it('should allow status updates via the status dropdown in the sidebar', () => {
    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)
    
    // Wait for all initial data to load
    cy.wait('@shortForm')
    cy.wait('@fieldUpdateCommentsGet')
    cy.wait('@leases')
    cy.wait('@rentalAssistances')
    cy.wait('@supplementals')
    cy.wait('@units')
    cy.wait('@leaseUpListing')

    // Ensure the status dropdown is visible and ready
    cy.get('.status-history-buttons button.dropdown-button', { timeout: 10000 })
      .first()
      .should('be.visible')
      .and('not.be.disabled')

    // Click on the status dropdown button at the bottom of the page
    cy.get('.status-history-buttons button.dropdown-button').first().click()

    // Wait for dropdown menu to be visible
    cy.get('.status-history-buttons ' + unselectedStatusMenuItem, { timeout: 5000 })
      .should('be.visible')

    // Select a status from the dropdown menu
    cy.get('.status-history-buttons ' + unselectedStatusMenuItem)
      .first()
      .click()

    // Wait for modal to be visible
    cy.get('.form-modal_form_wrapper', { timeout: 10000 }).should('be.visible')

    cy.testStatusModalUpdate()
    cy.wait('@fieldUpdateCommentsPost', { timeout: 15000 })
  })
})
