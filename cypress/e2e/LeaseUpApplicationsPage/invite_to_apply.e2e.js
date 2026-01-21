import { bulkActionCheckboxId, statusMenuItemSelector, usingFixtures } from '../../support/utils'
import { UNLEASH_URL } from '../../support/consts'

const rsvpSendEmailDropdown = '.filter-row .rsvp-dropdown__control .dropdown-button'
const SETUP_INVITE_TO_APPLY = 'set-up-invite-to-apply'
const LEASE_UP_LISTING_ID = Cypress.env('LEASE_UP_LISTING_ID')
const SECOND_ROW_LEASE_UP_APP_ID = Cypress.env('SECOND_ROW_LEASE_UP_APP_ID')
const THIRD_ROW_LEASE_UP_APP_ID = Cypress.env('THIRD_ROW_LEASE_UP_APP_ID')
const UPLOAD_URL_MODAL_TITLE = 'Add document upload URL'
const DEADLINE_MODAL_TITLE = 'Set document submission deadline'
const REVIEW_MODAL_TITLE = 'Review and send'

describe('LeaseUpApplicationsPage send email', () => {
  const visitLeaseUpListing = () => {
    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/lease-ups/listings/${LEASE_UP_LISTING_ID}`)
    cy.wait('@leaseUpListing')
    cy.wait('@leaseUpApplications')
  }

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

    cy.intercept('PUT', 'api/v1/listings/**', {
      statusCode: 200,
      body: 'true'
    }).as('inviteApplyUploadUrlPut')
    cy.intercept('PUT', 'api/v1/applications/**', {
      statusCode: 200,
      body: 'true'
    }).as('inviteApplyDeadlinePut')

    // always enable invite-to-apply feature flag for the test listing
    cy.intercept(
      'GET',
      `${UNLEASH_URL}**`,
      (request) => {
        request.continue((response) => {
          response.body.toggles.find(
            (toggle) => toggle.name === 'partners.inviteToApply'
          ).variant.payload.value = LEASE_UP_LISTING_ID
        })
      }
    ).as('inviteToApplyFeatureFlag')
  })

  it('should set document upload url and deadline for an Invite to Apply email', () => {
    visitLeaseUpListing()

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

  it('should send an invite to apply email', () => {
    cy.intercept('POST', 'api/v1/invite-to-apply', {
      statusCode: 200,
      body: 'true'
    }).as('inviteToApplyPost')

    visitLeaseUpListing()
    cy.get(bulkActionCheckboxId(SECOND_ROW_LEASE_UP_APP_ID)).click()
    cy.selectStatusDropdownValue(
      rsvpSendEmailDropdown,
      statusMenuItemSelector(SETUP_INVITE_TO_APPLY)
    )
    cy.get('#invite-to-apply-file-upload-url').type('https://www.sfgov.org')
    cy.contains('button', 'next').click()
    cy.get('#invite-to-apply-deadline_month').type('01')
    cy.get('#invite-to-apply-deadline_day').type('01')
    cy.get('#invite-to-apply-deadline_year').type('3000')
    cy.contains('button', 'save').click()
    cy.wait('@inviteApplyUploadUrlPut')
    cy.wait('@inviteApplyDeadlinePut')

    cy.contains(REVIEW_MODAL_TITLE).should('be.visible')
    cy.contains('button', 'send now').click()

    cy.wait('@inviteToApplyPost')
    cy.contains("We're sending your messages").should('be.visible')
  })

  it('should show an error when sending an invite to apply email goes wrong', () => {
    cy.intercept('POST', 'api/v1/invite-to-apply', {
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
    cy.get('#invite-to-apply-file-upload-url').type('https://www.sfgov.org')
    cy.contains('button', 'next').click()
    cy.get('#invite-to-apply-deadline_month').type('01')
    cy.get('#invite-to-apply-deadline_day').type('01')
    cy.get('#invite-to-apply-deadline_year').type('3000')
    cy.contains('button', 'save').click()
    cy.wait('@inviteApplyUploadUrlPut')
    cy.wait('@inviteApplyDeadlinePut')

    cy.contains(REVIEW_MODAL_TITLE).should('be.visible')
    cy.contains('button', 'send now').click()

    cy.wait('@inviteToApplyErrorPost')
    cy.get('@alertShown').should(
      'have.been.calledWith',
      'Oops! Looks like something went wrong. Please try again.'
    )
  })
})
