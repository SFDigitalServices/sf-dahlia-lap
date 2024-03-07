import { LEASE_UP_LISTING_APPLICATION_ID } from '../../support/consts'
import { generateRandomCurrency, usingFixtures } from '../../support/utils'

const rentSelector = '#form-lease\\.total_monthly_rent_without_parking'
const parkingDropdownSelector = '#form-lease\\.bmr_parking_space_assigned'
const parkingRentSelector = '#form-lease\\.monthly_parking_rent'
const tenantContributionSelector = '#form-lease\\.monthly_tenant_contribution'

describe('SupplementalApplicationPage lease section', () => {
  beforeEach(() => {
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
      cy.intercept('api/v1/supplementals/units?listing_id=**', { fixture: 'units.json' }).as(
        'units'
      )
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
  it('should allow saving of rents', () => {
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

    cy.get('button#edit-lease-button').click()

    // Generate the values (with currency and non-currency strings)
    const rentValue = generateRandomCurrency()
    const parkingRentValue = generateRandomCurrency()
    const tenantContributionValue = generateRandomCurrency()

    // Enter them
    cy.get(parkingDropdownSelector).select('Yes')
    cy.get(rentSelector).clear().type(rentValue.currency)
    cy.get(parkingRentSelector).clear().type(parkingRentValue.currency)
    cy.get(tenantContributionSelector).clear().type(tenantContributionValue.currency)

    // Click save
    cy.saveSupplementalApplication()
    cy.wait('@lease')

    // Verify that the values are there (they will be returned from salesforce as numbers, not currency)
    cy.getInputValue(rentSelector).should('equal', '$' + String(rentValue.float.toFixed(2)))
    cy.getInputValue(parkingRentSelector).should(
      'equal',
      '$' + String(parkingRentValue.float.toFixed(2))
    )
    cy.getInputValue(tenantContributionSelector).should(
      'equal',
      '$' + String(tenantContributionValue.float.toFixed(2))
    )
  })
})
