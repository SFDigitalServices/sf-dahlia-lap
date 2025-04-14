import { generateRandomCurrency, usingFixtures } from '../../support/utils'

const hhAssetsSelector = '#form-household_assets'
const hhImputedAssetsSelector = '#form-imputed_income_from_assets'
const confirmedAnnualSelector = '#form-confirmed_household_annual_income'
const finalHHAnnualSelector = '#form-hh_total_income_with_assets_annual'
const amiPercentageSelector = '#ami_percentage'
const amiChartTypeSelector = '#ami_chart_type'
const amiChartYearSelector = '#ami_chart_year'
const LEASE_UP_LISTING_APPLICATION_ID = Cypress.env('LEASE_UP_LISTING_APPLICATION_ID')

describe('SupplementalApplicationPage confirmed household income section', () => {
  beforeEach(() => {
    cy.setupIntercepts()
  })
  it('should allow saving of assets and incomes', () => {
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

    // Generate the values (with currency and non-currency strings)
    const hhAssetsValue = generateRandomCurrency()
    const hhImputedAssetsValue = generateRandomCurrency()
    const confirmedAnnualValue = generateRandomCurrency()
    const finalHHAnnualValue = generateRandomCurrency()

    // Enter them
    cy.get(hhAssetsSelector).clear().type(hhAssetsValue.currency)
    cy.get(hhImputedAssetsSelector).clear().type(hhImputedAssetsValue.currency)
    cy.get(confirmedAnnualSelector).clear().type(confirmedAnnualValue.currency)
    cy.get(finalHHAnnualSelector).clear().type(finalHHAnnualValue.currency)

    const chartType = 'MOHCD'
    const chartYear = '2024'

    // Enter AMI Info
    cy.get(amiPercentageSelector).clear().type('5.55')
    cy.get(amiChartTypeSelector).select(chartType)
    cy.get(amiChartYearSelector).select(chartYear)

    // Click save
    cy.saveSupplementalApplication(usingFixtures())

    // Verify that the values are there (as numbers, not currency)
    cy.getInputValue(hhAssetsSelector).should('equal', '$' + String(hhAssetsValue.float.toFixed(2)))
    cy.getInputValue(hhImputedAssetsSelector).should(
      'equal',
      '$' + String(hhImputedAssetsValue.float.toFixed(2))
    )
    cy.getInputValue(confirmedAnnualSelector).should(
      'equal',
      '$' + String(confirmedAnnualValue.float.toFixed(2))
    )
    cy.getInputValue(finalHHAnnualSelector).should(
      'equal',
      '$' + String(finalHHAnnualValue.float.toFixed(2))
    )
    cy.getInputValue(amiPercentageSelector).should('equal', '5.55%')
    cy.getInputValue(amiChartTypeSelector).should('equal', chartType)
    cy.getInputValue(amiChartYearSelector).should('equal', chartYear)
  })
})
