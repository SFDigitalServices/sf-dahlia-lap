import { bulkActionCheckboxId, statusMenuItemSelector, usingFixtures } from '../../support/utils'

const rsvpSendEmailDropdown = '.filter-row .rsvp-dropdown__control .dropdown-button'
const SETUP_INVITE_TO_APPLY = 'set-up-invite-to-apply'
const LEASE_UP_LISTING_ID = Cypress.env('LEASE_UP_LISTING_ID')
const SECOND_ROW_LEASE_UP_APP_ID = Cypress.env('SECOND_ROW_LEASE_UP_APP_ID')
const THIRD_ROW_LEASE_UP_APP_ID = Cypress.env('THIRD_ROW_LEASE_UP_APP_ID')
const UPLOAD_URL_MODAL_TITLE = 'Add document upload URL'
const DEADLINE_MODAL_TITLE = 'Set document submission deadline'

describe('LeaseUpApplicationsPage send email', () => {
  beforeEach(() => {
    if (usingFixtures()) {
      cy.intercept('api/v1/lease-ups/listings/**', { fixture: 'leaseUpListing.json' }).as(
        'leaseUpListing'
      )
      cy.intercept(`api/v1/lease-ups/applications?listing_id=${LEASE_UP_LISTING_ID}**`, {
        fixture: 'leaseUpApplications.json'
      }).as('leaseUpApplications')
    } else {
      cy.intercept('api/v1/lease-ups/listings/**').as('leaseUpListing')
      cy.intercept('api/v1/lease-ups/applications?listing_id=**').as('leaseUpApplications')
    }
  })

  it('should set document upload url and deadline for an Invite to Apply email', () => {
    cy.intercept('PUT', 'api/v1/listings/**', {
      statusCode: 200,
      body: 'true'
    }).as('inviteApplyUploadUrlPut')
    cy.intercept('PUT', 'api/v1/applications/**', {
      statusCode: 200,
      body: 'true'
    }).as('inviteApplyDeadlinePut')

    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/lease-ups/listings/${LEASE_UP_LISTING_ID}`)
    cy.wait('@leaseUpListing')
    cy.wait('@leaseUpApplications')

    // Check the checkboxes in the 2nd and 3rd row
    cy.get(bulkActionCheckboxId(SECOND_ROW_LEASE_UP_APP_ID)).click()
    cy.get(bulkActionCheckboxId(THIRD_ROW_LEASE_UP_APP_ID)).click()

    cy.get(bulkActionCheckboxId(SECOND_ROW_LEASE_UP_APP_ID)).should('be.checked')
    cy.get(bulkActionCheckboxId(THIRD_ROW_LEASE_UP_APP_ID)).should('be.checked')

    // Select Set up Invite to Apply option
    cy.selectStatusDropdownValue(
      rsvpSendEmailDropdown,
      statusMenuItemSelector(SETUP_INVITE_TO_APPLY)
    )

    cy.contains(UPLOAD_URL_MODAL_TITLE).should('be.visible')

    cy.get('#invite-to-apply-file-upload-url').type('https://www.sfgov.org')
    cy.contains('button', 'next').click()

    cy.contains(DEADLINE_MODAL_TITLE).should('be.visible')

    cy.get('#invite-to-apply-deadline_month').type('01')
    cy.get('#invite-to-apply-deadline_day').type('01')
    cy.get('#invite-to-apply-deadline_year').type('3000')
    cy.contains('button', 'save').click()

    cy.wait('@inviteApplyUploadUrlPut')
    // one request for each select application
    cy.wait('@inviteApplyDeadlinePut').wait('@inviteApplyDeadlinePut')

    cy.contains(DEADLINE_MODAL_TITLE).should('not.exist')
  })
})
