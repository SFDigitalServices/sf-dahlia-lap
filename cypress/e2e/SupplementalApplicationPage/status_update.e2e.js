import { LEASE_UP_LISTING_APPLICATION_ID } from '../../support/consts'

const unselectedStatusMenuItem = 'li[aria-selected="false"].dropdown-menu_item > a'

describe('SupplementalApplicationPage status history', () => {
  it('should allow status updates via the Add a Comment button in the status history section', () => {
    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)

    // Click on the "Add a Comment" button in the Status History sidebar
    cy.get('#add-status-history-comment').click()

    cy.testStatusModalUpdate()
  })
})

describe('SupplementalApplicationPage action buttons', () => {
  it('should allow status updates via the status dropdown in the sidebar', () => {
    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)

    // Click on the status dropdown button at the bottom of the page
    cy.get('.status-history-buttons button.dropdown-button ').first().click()

    // Select a status from the dropdown menu
    cy.get('.status-history-buttons ' + unselectedStatusMenuItem)
      .first()
      .click()

    cy.testStatusModalUpdate()
  })
})
