import { generateRandomCurrency, usingFixtures } from '../../support/utils'

const LEASE_UP_LISTING_APPLICATION_ID = Cypress.env('LEASE_UP_LISTING_APPLICATION_ID')

describe('SupplementalApplicationPage Rental Assistance Information section', () => {
  beforeEach(() => {
    cy.setupIntercepts()
    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)
    cy.wait('@shortForm')
    cy.wait('@fieldUpdateComments')
    cy.wait('@leases')
    cy.wait('@rentalAssistances')
    cy.wait('@supplementals')
    cy.wait('@units')
    cy.wait('@leaseUpListing')

    // Click on the Edit Lease button
    cy.get('button#edit-lease-button').click()
  })
  it('should allow a new rental assistance to be created', () => {
    let typeVal, typeLabel, recipientVal, recipientLabel, prevTableSize
    const recurring = 'Yes'
    const amount = 1100

    // Click on the Add Rental Assistance button in the Rental Assistance section
    cy.get('button#add-rental-assistance').click()

    // Set up and input the assistance type values
    cy.get('#rental-assistance-new-form .rental-assistance-type option:nth-child(2)').then(
      (option) => {
        console.log('type', option.val(), option.text())
        typeVal = option.val()
        cy.get('#rental-assistance-new-form .rental-assistance-type').select(typeVal)
        typeLabel = option.text()
      }
    )

    // Set up and input the assistance recipient values
    cy.get('#rental-assistance-new-form .rental-assistance-recipient option:nth-child(2)').then(
      (option) => {
        recipientVal = option.val()
        cy.get('#rental-assistance-new-form .rental-assistance-recipient').select(recipientVal)
        recipientLabel = option.text()
      }
    )

    // Record how many rental assistances are in the table before we attempt our create
    cy.get('.rental-assistances > tbody > .tr-expand').then((elem) => {
      prevTableSize = elem.length

      // Fill out the remainder of the new rental assistance form
      cy.get('#rental-assistance-new-form .rental-assistance-recurring input').first().click()
      // Enter the amount, as a string with "$" in it to test saving a currency value
      cy.get('#rental-assistance-new-form #assistance_amount').type(`$${amount}`)

      // Listen for the rental assistances request.
      if (usingFixtures()) {
        cy.intercept('POST', 'api/v1/rental-assistances', {
          fixture: 'rentalAssistancesPost.json'
        }).as('rentalAssistancesRequest')
      } else {
        cy.intercept({
          method: 'POST',
          url: 'api/v1/rental-assistances'
        }).as('rentalAssistancesRequest')
      }

      cy.get('#rental-assistance-new-form #rental-assistance-save').click()

      // Wait for the rental assistances request to complete.
      cy.wait('@rentalAssistancesRequest')

      cy.get('.rental-assistances > tbody > .tr-expand').should('have.length', prevTableSize + 1)

      const lastRentalAssistanceSelector =
        '.rental-assistances > tbody > .tr-expand:nth-last-child(2)'

      cy.get(`${lastRentalAssistanceSelector} td:nth-child(1)`)
        .invoke('text')
        .should('equal', recipientLabel)

      cy.get(`${lastRentalAssistanceSelector} td:nth-child(2)`)
        .invoke('text')
        .should('equal', typeLabel)

      cy.get(`${lastRentalAssistanceSelector} td:nth-child(3)`)
        .invoke('text')
        .should('equal', '$1,100.00')

      cy.get(`${lastRentalAssistanceSelector} td:nth-child(4)`)
        .invoke('text')
        .should('equal', recurring)
    })
  })

  it('should allow a rental assistance to be updated', () => {
    const firstRentalAssistanceSelector = '.rental-assistances > tbody > .tr-expand:first-child'
    const amount = 1101

    // Click the Edit button on the first rental assistance
    cy.get(`${firstRentalAssistanceSelector} button.action-link`).click()

    // Clear and enter a new amount value
    cy.get('#assistance_amount').clear().type(`$${amount}`)

    if (usingFixtures()) {
      cy.intercept('PUT', 'api/v1/rental-assistances/**', {
        fixture: 'rentalAssistancesPut.json'
      }).as('rentalAssistancesRequest')
    } else {
      cy.intercept({
        method: 'PUT',
        url: 'api/v1/rental-assistances/**'
      }).as('rentalAssistancesRequest')
    }

    cy.get('#rental-assistance-save').click()

    // Wait for the rental assistances request to complete.
    cy.wait('@rentalAssistancesRequest')

    // Check that the first rental assistance's amount value matches the value we updated it to
    cy.get(`${firstRentalAssistanceSelector} td:nth-child(3)`)
      .invoke('text')
      .should('equal', '$1,101.00')

    cy.get(`${firstRentalAssistanceSelector} button.action-link`).click()

    cy.get('#assistance_amount').invoke('val').should('equal', '$1,101.00')
  })

  // This test requires a rental assistance to be already present in the rental
  // assistances table. If the prior test for creating a rental assistance has
  // succeeded, then there will be at least one rental assistance present.
  it('should persist all unsaved supp app form values when a rental assistance panel is saved', () => {
    const hhAssetsSelector = '#form-household_assets'
    const hhAssetsNewValue = generateRandomCurrency()
    const firstRentalAssistanceSelector = '.rental-assistances > tbody > .tr-expand:first-child'

    // Change a value on the supp app form outside of the rental assistance panels
    // (and also outside of the confirmed preference panels)
    cy.get(hhAssetsSelector).clear().type(hhAssetsNewValue.currency)

    // Click the Edit button on the first rental assistance
    cy.get(`${firstRentalAssistanceSelector} button.action-link`).click()

    // Enter a new assistance amount value
    cy.get('#assistance_amount').clear().type('$1102')

    // Listen for the rental assistances request.
    if (usingFixtures()) {
      cy.intercept('PUT', 'api/v1/rental-assistances/**', {
        fixture: 'rentalAssistancesPut.json'
      }).as('rentalAssistancesRequest')
    } else {
      cy.intercept({
        method: 'PUT',
        url: 'api/v1/rental-assistances/**'
      }).as('rentalAssistancesRequest')
    }

    cy.get('#rental-assistance-edit-form-0 #rental-assistance-save').click()

    // Wait for the rental assistances request to complete.
    cy.wait('@rentalAssistancesRequest')

    // Check that the field we changed outside of the rental assistance panel
    // still has the new value we entered
    cy.get(hhAssetsSelector)
      .invoke('val')
      .should('equal', '$' + String(hhAssetsNewValue.float.toFixed(2)))
  })

  // This test requires a rental assistance to be already present in the rental
  // assistances table. If the prior test for creating a rental assistance has
  // succeeded, then there will be at least one rental assistance present.
  it('should allow a rental assistance to be deleted', () => {
    // Record how many rental assistances are in the table before we attempt our delete
    let prevTableSize
    cy.get('.rental-assistances > tbody > .tr-expand').then(($rows) => {
      prevTableSize = $rows.length

      // Click the Edit button on the first rental assistance
      const firstRentalAssistanceSelector = '.rental-assistances > tbody > .tr-expand:first-child'
      cy.get(`${firstRentalAssistanceSelector} button.action-link`).click()

      // Wait for the edit rental assistance form to open
      cy.get('#rental-assistance-edit-form-0').should('exist')

      // Wait for the API rental assistance delete call to complete
      if (usingFixtures()) {
        cy.intercept('DELETE', 'api/v1/rental-assistances/**', {
          fixture: 'rentalAssistancesDelete.json'
        }).as('deleteRequest')
      } else {
        cy.intercept({
          method: 'DELETE',
          url: 'api/v1/rental-assistances/**'
        }).as('deleteRequest')
      }

      // Delete the rental assistance
      cy.get('#rental-assistance-delete').click()

      cy.wait('@deleteRequest')

      // Check that the rental assistances table has decreased in size by one
      cy.get('.rental-assistances > tbody > .tr-expand').should('have.length', prevTableSize - 1)
    })
  })
})
