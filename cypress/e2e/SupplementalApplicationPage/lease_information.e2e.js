import { LEASE_UP_LISTING_APPLICATION_ID } from '../../support/consts'
import { generateRandomCurrency } from '../../support/utils'

const rentSelector = '#form-lease\\.total_monthly_rent_without_parking'
const parkingDropdownSelector = '#form-lease\\.bmr_parking_space_assigned'
const parkingRentSelector = '#form-lease\\.monthly_parking_rent'
const tenantContributionSelector = '#form-lease\\.monthly_tenant_contribution'

describe('SupplementalApplicationPage lease section', () => {
  it('should allow saving of rents', () => {
    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)

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
