import { LEASE_UP_LISTING_APPLICATION_ID } from '../../support/consts'

const mobilitySelector = 'input#form-has_ada_priorities_selected\\.mobility_impairments'
const shortFormTabSelector = '.tabs li:nth-child(2)'
const supplementalTabSelector = '.tabs li:nth-child(1)'
describe('SupplementalApplicationPage clicking on the short form tab', () => {
  it('should not erase updates made on the supp app tab', () => {
    let originalCheckboxValue
    let checkboxAfterClick

    cy.visit('http://localhost:3000/')
    cy.login()

    // Load the supp app
    cy.visit(`/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)

    // Change value for ada priorities, mobility impairments
    cy.get(mobilitySelector)
      .invoke('prop', 'checked')
      .then((checked) => {
        originalCheckboxValue = checked
      })
    cy.get(mobilitySelector).click()
    // Get the value of the checkbox after the click and compare it with the initial value
    cy.get(mobilitySelector)
      .invoke('prop', 'checked')
      .then((val) => {
        checkboxAfterClick = val
        cy.wrap(checkboxAfterClick).should('not.equal', originalCheckboxValue)
      })

    cy.get(shortFormTabSelector).click()

    // Expect that the short form application shows
    cy.contains('Application Data').should('exist')

    // Click back to the supp app tab
    cy.get(supplementalTabSelector).click()

    // Expect that the changes are still there
    cy.get(mobilitySelector)
      .invoke('prop', 'checked')
      .then((val) => {
        cy.wrap(val).should('equal', checkboxAfterClick)
      })
  })
})
