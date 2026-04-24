import {
  bulkActionCheckboxId,
  statusMenuItemSelector,
  usingFixtures,
  interceptInviteToApplyFlag
} from '../../support/utils'
const rsvpSendEmailDropdown = '.filter-row .rsvp-dropdown__control .dropdown-button'
const SETUP_INVITE_TO_APPLY = 'set-up-invite-to-apply'
const LEASE_UP_LISTING_ID = Cypress.env('LEASE_UP_LISTING_ID')
const SECOND_ROW_LEASE_UP_APP_ID = Cypress.env('SECOND_ROW_LEASE_UP_APP_ID')
const REVIEW_MODAL_TITLE = 'Review and send'
const LISTING_ENDPOINT = '**/api/v1/lease-ups/listings/**'
const APPLICATIONS_ENDPOINT = '**/api/v1/lease-ups/applications?listing_id=**'
const MESSAGE_ENDPOINT = '**/api/v1/message**'
const LISTINGS_PUT_ENDPOINT = '**/api/v1/listings/**'
const APPLICATIONS_PUT_ENDPOINT = '**/api/v1/applications/**'

describe('LeaseUpApplicationsPage send email', () => {
  const visitLeaseUpListing = () => {
    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/lease-ups/listings/${LEASE_UP_LISTING_ID}`)
    cy.wait('@inviteToApplyFeatureFlag')
    cy.wait('@leaseUpListing')
    cy.wait('@leaseUpApplications')
  }

  const fillInviteToApplyFlow = () => {
    cy.get('#invite-to-apply-file-upload-url').type('https://www.sfgov.org')
    cy.get('.form-modal_form_wrapper')
      .contains('button', /^next$/i)
      .click()
    cy.get('#invite-to-apply-deadline_month').type('01')
    cy.get('#invite-to-apply-deadline_day').type('01')
    cy.get('#invite-to-apply-deadline_year').type('3000')
    cy.get('.form-modal_form_wrapper')
      .contains('button', /^save$/i)
      .click()
  }

  beforeEach(() => {
    cy.viewport(1920, 1920) // larger viewport fixes a flaky issue where modals will not appear on click
    if (usingFixtures()) {
      cy.intercept(LISTING_ENDPOINT, { fixture: 'leaseUpListing.json' }).as('leaseUpListing')
      cy.intercept(`**/api/v1/lease-ups/applications?listing_id=${LEASE_UP_LISTING_ID}**`, {
        fixture: 'leaseUpApplications.json'
      }).as('leaseUpApplications')
    } else {
      cy.intercept(LISTING_ENDPOINT).as('leaseUpListing')
      cy.intercept(APPLICATIONS_ENDPOINT).as('leaseUpApplications')
    }

    cy.intercept('PUT', LISTINGS_PUT_ENDPOINT, {
      statusCode: 200,
      body: 'true'
    }).as('inviteApplyUploadUrlPut')
    cy.intercept('PUT', APPLICATIONS_PUT_ENDPOINT, {
      statusCode: 200,
      body: 'true'
    }).as('inviteApplyApplicationsPut')

    interceptInviteToApplyFlag(LEASE_UP_LISTING_ID)
  })

  it('should send an invite to apply email', () => {
    cy.intercept('POST', MESSAGE_ENDPOINT, {
      statusCode: 200,
      body: 'true'
    }).as('inviteToApplyPost')

    visitLeaseUpListing()
    cy.get(bulkActionCheckboxId(SECOND_ROW_LEASE_UP_APP_ID)).click()
    cy.selectStatusDropdownValue(
      rsvpSendEmailDropdown,
      statusMenuItemSelector(SETUP_INVITE_TO_APPLY)
    )
    fillInviteToApplyFlow()

    cy.contains('.modal-title', REVIEW_MODAL_TITLE).should('be.visible')
    cy.get('.form-modal_form_wrapper')
      .contains('button', /^send now$/i)
      .click()

    cy.wait('@inviteApplyApplicationsPut')
    cy.wait('@inviteToApplyPost')
    cy.contains("We're sending your messages").should('be.visible')
  })

  it('should show an error when sending an invite to apply email goes wrong', () => {
    cy.intercept('POST', MESSAGE_ENDPOINT, {
      statusCode: 500,
      body: ''
    }).as('inviteToApplyErrorPost')

    const alertStub = cy.stub().as('alertShown')
    cy.on('window:alert', alertStub)

    visitLeaseUpListing()
    cy.get(bulkActionCheckboxId(SECOND_ROW_LEASE_UP_APP_ID)).click()
    cy.selectStatusDropdownValue(
      rsvpSendEmailDropdown,
      statusMenuItemSelector(SETUP_INVITE_TO_APPLY)
    )
    fillInviteToApplyFlow()

    cy.contains('.modal-title', REVIEW_MODAL_TITLE).should('be.visible')
    cy.get('.form-modal_form_wrapper')
      .contains('button', /^send now$/i)
      .click()

    cy.wait('@inviteApplyApplicationsPut')
    cy.wait('@inviteToApplyErrorPost')
    cy.get('@alertShown').should(
      'have.been.calledWith',
      'Oops! Looks like something went wrong. Please try again.'
    )
  })
})
