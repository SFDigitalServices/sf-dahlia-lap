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
const LEASE_UP_LISTING_ID = Cypress.env('LEASE_UP_LISTING_ID')
const SECOND_ROW_LEASE_UP_APP_ID = Cypress.env('SECOND_ROW_LEASE_UP_APP_ID')
const THIRD_ROW_LEASE_UP_APP_ID = Cypress.env('THIRD_ROW_LEASE_UP_APP_ID')

describe('LeaseUpApplicationsPage status update', () => {
  describe('using the individual row status dropdown', () => {
    beforeEach(() => {
      if (usingFixtures()) {
        cy.intercept('api/v1/lease-ups/listings/**', { fixture: 'leaseUpListing.json' }).as(
          'leaseUpListing'
        )
        cy.intercept(`api/v1/lease-ups/applications?listing_id=${LEASE_UP_LISTING_ID}**`, {
          fixture: 'leaseUpApplications.json'
        }).as('leaseUpApplications')
        cy.intercept('api/v1/applications/**/field_update_comments', {
          fixture: 'fieldUpdateComments.json'
        }).as('fieldUpdateComments')
      } else {
        cy.intercept('api/v1/lease-ups/listings/**').as('leaseUpListing')
        cy.intercept('api/v1/lease-ups/applications?listing_id=**').as('leaseUpApplications')
        cy.intercept('api/v1/applications/**/field_update_comments').as('fieldUpdateComments')
      }
    })
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
        cy.get(bulkActionCheckboxId(SECOND_ROW_LEASE_UP_APP_ID), { timeout: 10000 })
          .should('be.visible')
          .click()
        cy.get(bulkActionCheckboxId(THIRD_ROW_LEASE_UP_APP_ID), { timeout: 10000 })
          .should('be.visible')
          .click()

        cy.get(bulkActionCheckboxId(SECOND_ROW_LEASE_UP_APP_ID)).should('be.checked')
        cy.get(bulkActionCheckboxId(THIRD_ROW_LEASE_UP_APP_ID)).should('be.checked')

        // Select Processing as bulk status
        cy.selectStatusDropdownValue(bulkStatusDropdown, statusMenuItemSelector(PROCESSING))
        // Fill out the status modal and submit
        // Wait for field update comment requests to complete and fail if they were unsuccessful.
        // The problem is that if one of these requests does not happen we get an ambiguous timeout error.
        cy.checkForStatusUpdateSuccess()
        cy.fillOutAndSubmitStatusModal()
        cy.wait('@fieldUpdateComments', { timeout: 15000 })

        // Wait for modal to close
        cy.get('.ReactModal__Overlay.ReactModal__Overlay--after-open', { timeout: 15000 }).should(
          'not.exist'
        )

        // Wait for UI to update after modal closes
        cy.wait(1000)

        // Expect checkboxes to be unchecked and statuses to be updated
        cy.getText(nthRowStatusDropdownSelector(2)).should('contain', PROCESSING)
        cy.getText(nthRowStatusDropdownSelector(3)).should('contain', PROCESSING)

        cy.get(bulkActionCheckboxId(SECOND_ROW_LEASE_UP_APP_ID)).should('not.be.checked')
        cy.get(bulkActionCheckboxId(THIRD_ROW_LEASE_UP_APP_ID)).should('not.be.checked')

        // Repeat with status Appealed
        cy.get(bulkActionCheckboxId(SECOND_ROW_LEASE_UP_APP_ID), { timeout: 10000 })
          .should('be.visible')
          .and('not.be.disabled')
          .click()
        cy.get(bulkActionCheckboxId(THIRD_ROW_LEASE_UP_APP_ID), { timeout: 10000 })
          .should('be.visible')
          .and('not.be.disabled')
          .click()

        cy.get(bulkActionCheckboxId(SECOND_ROW_LEASE_UP_APP_ID)).should('be.checked')
        cy.get(bulkActionCheckboxId(THIRD_ROW_LEASE_UP_APP_ID)).should('be.checked')

        // Select Appealed as bulk status
        cy.selectStatusDropdownValue(bulkStatusDropdown, statusMenuItemSelector(APPEALED))

        cy.checkForStatusUpdateSuccess()
        cy.fillOutAndSubmitStatusModal()
        cy.wait('@fieldUpdateComments', { timeout: 15000 })

        // Wait for modal to close
        cy.get('.ReactModal__Overlay.ReactModal__Overlay--after-open', { timeout: 15000 }).should(
          'not.exist'
        )

        // Wait for UI to update after modal closes
        cy.wait(1000)

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
          cy.contains('button', 'Add Comment').click()

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
  describe('filters', () => {
    describe('using the application filters', () => {
      // filter tests require calling the real API, fixtures do not work
      beforeEach(() => {
        cy.intercept('api/v1/lease-ups/listings/**').as('leaseUpListing')
        cy.intercept('api/v1/lease-ups/applications?listing_id=**').as('leaseUpApplications')
      })
      it('should use all filters and update URL', () => {
        cy.visit('http://localhost:3000/')
        cy.login()
        cy.visit(`/lease-ups/listings/${LEASE_UP_LISTING_ID}`)
        cy.wait('@leaseUpListing')
        cy.wait('@leaseUpApplications')

        cy.contains('button', 'Show Filters').click()

        cy.get('div[role="grid"] input[type="checkbox"]')
          .its('length')
          .then((initialCount) => {
            cy.get('[data-testid="multiSelectField"]')
              .eq(0)
              .within(() => {
                cy.get('input').first().click()
                cy.findByText('Certificate of Preference (COP)').click()
              })

            cy.get('[data-testid="multiSelectField"]')
              .eq(1)
              .within(() => {
                cy.get('input').first().click()
                cy.findByText('1').click()
                cy.get('input').first().click()
                cy.findByText('2').click()
              })

            cy.get('[data-testid="multiSelectField"]')
              .eq(2)
              .within(() => {
                cy.get('input').first().click()
                cy.findByText('Mobility').click()
                cy.get('input').first().click()
                cy.findByText('Vision/Hearing').click()
              })

            cy.get('[data-testid="multiSelectField"]')
              .eq(3)
              .within(() => {
                cy.get('input').first().click()
                cy.findByText('Processing').click()

                // Submit the form by hitting enter
                cy.get('input').first().type('{enter}')
              })

            cy.get('div[role="grid"] input[type="checkbox"]')
              .its('length')
              .should('be.lessThan', initialCount)

            cy.url().should(
              'equal',
              `http://localhost:3000/lease-ups/listings/${LEASE_UP_LISTING_ID}?preference=Certificate+of+Preference+%28COP%29&total_household_size=1&total_household_size=2&accessibility=Mobility+impairments&accessibility=Vision+impairments%2C+Hearing+impairments&status=Processing`
            )

            cy.get('input[name="search"]').type('Andrew{enter}')

            cy.url().should(
              'equal',
              `http://localhost:3000/lease-ups/listings/${LEASE_UP_LISTING_ID}?preference=Certificate+of+Preference+%28COP%29&total_household_size=1&total_household_size=2&accessibility=Mobility+impairments&accessibility=Vision+impairments%2C+Hearing+impairments&status=Processing&search=Andrew`
            )

            cy.contains('button', 'Clear all').click()

            cy.url().should(
              'equal',
              `http://localhost:3000/lease-ups/listings/${LEASE_UP_LISTING_ID}?search=Andrew`
            )

            cy.contains('button', 'Hide Filters').click()

            cy.get('button[data-testid="search-icon"]').click()

            cy.url().should(
              'equal',
              `http://localhost:3000/lease-ups/listings/${LEASE_UP_LISTING_ID}`
            )

            cy.get('div[role="grid"] input[type="checkbox"]')
              .its('length')
              .should('equal', initialCount)
          })
      })

      it('should use the URL to update filters', () => {
        cy.visit('http://localhost:3000/')
        cy.login()
        cy.visit(
          `/lease-ups/listings/${LEASE_UP_LISTING_ID}?preference=Certificate+of+Preference+%28COP%29&total_household_size=1&total_household_size=2&accessibility=Mobility+impairments&accessibility=Vision+impairments%2C+Hearing+impairments&status=Approved&search=Andrew`
        )
        cy.wait('@leaseUpListing')

        cy.contains('button', 'Hide Filters').should('exist')

        cy.get('[data-testid="multiSelectField"]')
          .eq(0)
          .within(() => {
            cy.contains('Certificate of Preference (COP)').should('exist')
          })

        cy.get('[data-testid="multiSelectField"]')
          .eq(1)
          .within(() => {
            cy.contains('1').should('exist')
            cy.contains('2').should('exist')
          })

        cy.get('[data-testid="multiSelectField"]')
          .eq(2)
          .within(() => {
            cy.contains('Mobility').should('exist')
            cy.contains('Vision/Hearing').should('exist')
          })

        cy.get('[data-testid="multiSelectField"]')
          .eq(3)
          .within(() => {
            cy.contains('Approved').should('exist')
          })

        cy.get('#test-search').should('have.value', 'Andrew')

        cy.contains('button', 'Clear all').click()

        cy.url().should(
          'equal',
          `http://localhost:3000/lease-ups/listings/${LEASE_UP_LISTING_ID}?search=Andrew`
        )

        cy.get('button[data-testid="search-icon"]').click()

        cy.url().should('equal', `http://localhost:3000/lease-ups/listings/${LEASE_UP_LISTING_ID}`)
      })
    })
  })
})
