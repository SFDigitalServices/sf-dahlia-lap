import {
  LEASE_UP_LISTING_ID,
  SECOND_ROW_LEASE_UP_APP_ID,
  THIRD_ROW_LEASE_UP_APP_ID
} from '../../support/consts'
import {
  bulkActionCheckboxId,
  statusMenuItemSelector,
  nthRowStatusDropdownSelector,
  usingFixtures
} from '../../support/utils'

const firstRowStatusDropdown = '.rt-tr-group:first-child .rt-td .dropdown .dropdown-button'
const secondRowSubstatus = '.rt-tr-group:nth-child(2) .rt-td:nth-child(9)'
const unselectedStatusMenuItem = 'li[aria-selected="false"].dropdown-menu_item > a'
const bulkStatusDropdown = '.filter-row .status-dropdown__control .dropdown-button'
const PROCESSING = 'Processing'
const APPEALED = 'Appealed'

describe('LeaseUpApplicationsPage status update', () => {
  beforeEach(() => {
    if (usingFixtures()) {
      cy.intercept('api/v1/lease-ups/listings/**', { fixture: 'leaseUpListing.json' }).as(
        'leaseUpListing'
      )
      cy.intercept('api/v1/lease-ups/applications?listing_id=**&page=0', {
        fixture: 'leaseUpApplications.json'
      }).as('leaseUpApplications')
      cy.intercept('api/v1/applications/**/field_update_comments', {
        fixture: 'fieldUpdateComments.json'
      }).as('fieldUpdateComments')
    } else {
      cy.intercept('api/v1/lease-ups/listings/**').as('leaseUpListing')
      cy.intercept('api/v1/lease-ups/applications?listing_id=**&page=0').as('leaseUpApplications')
      cy.intercept('api/v1/applications/**/field_update_comments').as('fieldUpdateComments')
    }
  })
  describe('using the individual row status dropdown', () => {
    it('should change status, substatus, and last updated date for the application application', () => {
      let originalStatus

      cy.visit('http://localhost:3000/')
      cy.login()
      cy.visit(`/lease-ups/listings/${LEASE_UP_LISTING_ID}`)
      cy.wait('@leaseUpListing')
      cy.wait('@leaseUpApplications')

      // Change status to one that is not currently selected.
      cy.getText(firstRowStatusDropdown).then((text) => {
        originalStatus = text
      })
      cy.selectStatusDropdownValue(firstRowStatusDropdown, unselectedStatusMenuItem)

      // Fill out the status modal and submit.
      cy.checkForStatusUpdateSuccess()
      cy.fillOutAndSubmitStatusModal()
      cy.wait('@fieldUpdateComments')

      // Get changed status, it should be different
      cy.getText(firstRowStatusDropdown).should('not.equal', originalStatus)
    })
    describe('using the bulk update checkboxes', () => {
      it('should change the status for selected checkboxes', () => {
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

        // Select Processing as bulk status
        cy.selectStatusDropdownValue(bulkStatusDropdown, statusMenuItemSelector(PROCESSING))
        // Fill out the status modal and submit
        // Wait for field update comment requests to complete and fail if they were unsuccessful.
        // The problem is that if one of these requests does not happen we get an ambiguous timeout error.
        cy.checkForStatusUpdateSuccess()
        cy.fillOutAndSubmitStatusModal()
        cy.wait('@fieldUpdateComments')

        // Expect checkboxes to be unchecked and statuses to be updated
        cy.getText(nthRowStatusDropdownSelector(2)).should('contain', PROCESSING)
        cy.getText(nthRowStatusDropdownSelector(3)).should('contain', PROCESSING)

        cy.get(bulkActionCheckboxId(SECOND_ROW_LEASE_UP_APP_ID)).should('not.be.checked')
        cy.get(bulkActionCheckboxId(THIRD_ROW_LEASE_UP_APP_ID)).should('not.be.checked')

        // Repeat with status Appealed
        cy.get(bulkActionCheckboxId(SECOND_ROW_LEASE_UP_APP_ID)).click()
        cy.get(bulkActionCheckboxId(THIRD_ROW_LEASE_UP_APP_ID)).click()

        // Select Appealed as bulk status
        cy.selectStatusDropdownValue(bulkStatusDropdown, statusMenuItemSelector(APPEALED))

        cy.checkForStatusUpdateSuccess()
        cy.fillOutAndSubmitStatusModal()
        cy.wait('@fieldUpdateComments')

        cy.getText(nthRowStatusDropdownSelector(2)).should('contain', APPEALED)
        cy.getText(nthRowStatusDropdownSelector(3)).should('contain', APPEALED)
      })

      it('should clear bulk checkboxes when next page is clicked', () => {
        const bulkEditCheckboxId = '#bulk-edit-controller'

        cy.visit('http://localhost:3000/')
        cy.login()
        cy.visit(`/lease-ups/listings/${LEASE_UP_LISTING_ID}`)
        cy.wait('@leaseUpListing')
        cy.wait('@leaseUpApplications')

        cy.get(bulkEditCheckboxId).click()

        cy.get(bulkEditCheckboxId).should('be.checked')

        cy.get('.-pagination .-next .-btn').click()
        cy.get(bulkEditCheckboxId).should('not.be.checked')
      })

      describe('add a comment button', () => {
        it('should not update status and substatus', () => {
          cy.visit('http://localhost:3000/')
          cy.login()
          cy.visit(`/lease-ups/listings/${LEASE_UP_LISTING_ID}`)
          cy.wait('@leaseUpListing')
          cy.wait('@leaseUpApplications')

          const originalStatus = cy.getText(nthRowStatusDropdownSelector(2))
          const originalSubStatus = cy.getText(secondRowSubstatus)

          // Check the checkbox in the 2nd row
          cy.get(bulkActionCheckboxId(SECOND_ROW_LEASE_UP_APP_ID)).click()

          // Click on Add Comment
          cy.get('.filter-group_action button:nth-child(2)').click()

          cy.checkForStatusUpdateSuccess()
          cy.fillOutAndSubmitStatusModal(true)
          cy.wait('@fieldUpdateComments')

          // Expect checkboxes to be unchecked and statuses not to change
          cy.getText(nthRowStatusDropdownSelector(2)).should('not.equal', originalStatus)
          cy.getText(secondRowSubstatus).should('not.equal', originalSubStatus)
        })
      })
    })
  })
})
