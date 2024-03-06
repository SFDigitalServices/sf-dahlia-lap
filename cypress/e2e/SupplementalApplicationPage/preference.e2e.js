import { LEASE_UP_LISTING_APPLICATION_ID } from '../../support/consts'
import {
  notSelectedOptionSelector,
  selectedOptionSelector,
  generateRandomCurrency
} from '../../support/utils'

describe('SupplementalApplicationPage Confirmed Preferences section', () => {
  it('should allow updates to live/work preference', () => {
    const liveWorkEditSelector = '[id$=in-san-francisco-preference-edit]'
    const liveWorkRowSelector = '[id$=in-san-francisco-preference-row]'
    const liveWorkExpandedPanelSelector = '[id$=in-san-francisco-preference-panel]'
    const individualPreferenceSelector = `${liveWorkExpandedPanelSelector} .individual-preference-select`
    const typeOfProofSelector = `${liveWorkExpandedPanelSelector} .type-of-proof-select`
    const prefStatusSelector = `${liveWorkExpandedPanelSelector} .preference-status-select`

    const unselectedPreferenceSelector = notSelectedOptionSelector(individualPreferenceSelector)
    const unselectedTypeOfProofSelector = notSelectedOptionSelector(typeOfProofSelector)
    const unselectedPrefStatusSelector = notSelectedOptionSelector(prefStatusSelector)

    let prefToSetName
    let typeOfProofToSetName
    let prefStatusToSetName

    cy.visit('http://localhost:3000/')
    cy.login()
    // The application used here must include a claimed live/work
    // preference for this test to be able to pass.
    cy.visit(`/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)

    // Click on the live/work preference's Edit button in the Confirmed
    // Preferences section to expand that preference's edit panel
    cy.get(liveWorkEditSelector).click()

    // Update the individual preference (select Live vs Work in SF)
    cy.get(unselectedPreferenceSelector)
      .invoke('text')
      .then((text) => {
        prefToSetName = text
      })
    cy.get(unselectedPreferenceSelector)
      .invoke('val')
      .then((value) => {
        cy.get(individualPreferenceSelector).select(value)
      })

    // Update the type of proof
    cy.get(unselectedTypeOfProofSelector)
      .first()
      .invoke('text')
      .then((text) => {
        typeOfProofToSetName = text
      })
    cy.get(unselectedTypeOfProofSelector)
      .invoke('val')
      .then((value) => {
        cy.get(typeOfProofSelector).select(value)
      })

    // Update the preference status
    cy.get(unselectedPrefStatusSelector)
      .first()
      .invoke('text')
      .then((text) => {
        prefStatusToSetName = text
      })
    cy.get(unselectedPrefStatusSelector)
      .invoke('val')
      .then((value) => {
        cy.get(prefStatusSelector).select(value)
      })

    cy.intercept({
      method: 'PUT',
      url: '**/api/v1/preferences/*'
    }).as('updateRequest')

    // Click the save button in the preference panel
    cy.get(`${liveWorkExpandedPanelSelector} .save-panel-btn`).click()

    // Wait for the preference update request to complete.
    cy.wait('@updateRequest')

    // Validate that the panel has collapsed
    cy.get(liveWorkExpandedPanelSelector).should('have.attr', 'aria-hidden', 'true')

    // Validate that values were updated in the table.
    cy.get(`${liveWorkRowSelector} td`).then((tds) => {
      const liveWorkRowValues = tds.map((i, td) => Cypress.$(td).text()).get()

      cy.wrap(liveWorkRowValues[1]).should('include', prefToSetName.split(' ')[0])
      cy.wrap(liveWorkRowValues[4]).should('equal', typeOfProofToSetName)
      cy.wrap(liveWorkRowValues[5]).should('equal', prefStatusToSetName)
    })

    // Reload the page
    cy.reload()

    // Open the same preference edit panel as before
    cy.get(liveWorkEditSelector).click()

    // Check that the value entered for individual preference, type of proof, and status were successfully saved
    // and now appears in the preference panel
    cy.get(selectedOptionSelector(individualPreferenceSelector))
      .invoke('text')
      .then((currentValue) => {
        cy.wrap(currentValue).should('equal', prefToSetName)
      })

    cy.get(selectedOptionSelector(typeOfProofSelector))
      .invoke('text')
      .then((currentValue) => {
        cy.wrap(currentValue).should('equal', typeOfProofToSetName)
      })

    cy.get(selectedOptionSelector(prefStatusSelector))
      .invoke('text')
      .then((currentValue) => {
        cy.wrap(currentValue).should('equal', prefStatusToSetName)
      })
  })

  it('should allow updates to assisted housing preference', () => {
    const assistedHousingEditSelector = '#assisted-housing-preference-edit'
    const assistedHousingRowSelector = '#assisted-housing-preference-row'
    const assistedHousingExpandedPanelSelector = '#assisted-housing-preference-panel'
    const prefStatusSelector = `${assistedHousingExpandedPanelSelector} .preference-status-select`
    let prefStatusToSetName

    const unselectedPrefStatusSelector = notSelectedOptionSelector(prefStatusSelector)

    cy.visit('http://localhost:3000/')
    cy.login()
    // The application used here must include a claimed assisted housing
    // preference for this test to be able to pass.
    cy.visit(`/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)

    // Click on the assisted housing preference's Edit button in the Confirmed
    // Preferences section to expand that preference's edit panel
    cy.get(assistedHousingEditSelector).click()

    cy.get(unselectedPrefStatusSelector)
      .first()
      .invoke('text')
      .then((text) => {
        prefStatusToSetName = text
      })

    // Update the preference status
    cy.get(unselectedPrefStatusSelector)
      .invoke('val')
      .then((value) => {
        cy.get(prefStatusSelector).select(value)
      })

    cy.intercept({
      method: 'PUT',
      url: '**/api/v1/preferences/*'
    }).as('updateRequest')

    // Click the save button in the preference panel
    cy.get(`${assistedHousingExpandedPanelSelector} .save-panel-btn`).click()

    // Wait for the API preference update call to complete
    cy.wait('@updateRequest')

    // Validate that the panel has collapsed
    cy.get(assistedHousingExpandedPanelSelector).should('have.attr', 'aria-hidden', 'true')

    // Validate that values were updated in the table.
    cy.get(`${assistedHousingRowSelector} td`).then(($tds) => {
      const assistedHousingRowValues = $tds.map((i, td) => Cypress.$(td).text()).get()

      cy.wrap(assistedHousingRowValues[5]).should('equal', prefStatusToSetName)
    })

    // Reload the page
    cy.reload()

    // Open the same preference edit panel as before
    cy.get(assistedHousingEditSelector).click()

    // Check that the value entered for status was successfully saved
    // and now appears in the preference panel
    cy.get(selectedOptionSelector(prefStatusSelector))
      .invoke('text')
      .then((currentStatus) => {
        cy.wrap(currentStatus).should('equal', prefStatusToSetName)
      })
  })

  it('should persist all unsaved supp app form values when a confirmed preference panel is saved', () => {
    const assistedHousingEditSelector = '#assisted-housing-preference-edit'
    const assistedHousingExpandedPanelSelector = '#assisted-housing-preference-panel'
    const prefStatusSelector = `${assistedHousingExpandedPanelSelector} .preference-status-select`

    const unselectedPrefStatusSelector = notSelectedOptionSelector(prefStatusSelector)

    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/lease-ups/applications/${LEASE_UP_LISTING_APPLICATION_ID}`)

    // Change a value on the supp app form outside of the confirmed preference panels
    // (and also outside of the rental assistance panels)
    const hhAssetsSelector = '#form-household_assets'
    const hhAssetsNewValue = generateRandomCurrency()
    cy.get(hhAssetsSelector).clear().type(hhAssetsNewValue.currency)

    // Save an update in a preference panel. We'll use the assisted housing preference.
    // The application used here must include a claimed assisted housing
    // preference for this test to be able to pass.

    // Click on the assisted housing preference's Edit button in the Confirmed
    // Preferences section to expand that preference's edit panel

    cy.get(assistedHousingEditSelector).click()

    // Update the preference status
    cy.get(unselectedPrefStatusSelector)
      .invoke('val')
      .then((value) => {
        cy.get(prefStatusSelector).select(value)
      })

    cy.intercept({
      method: 'PUT',
      url: '**/api/v1/preferences/*'
    }).as('updateRequest')

    // Click the save button in the preference panel
    cy.get(`${assistedHousingExpandedPanelSelector} .save-panel-btn`).click()

    // Wait for the preference update request to complete.
    cy.wait('@updateRequest')

    // Check that the field we changed outside of the preference panel
    // still has the new value we entered
    cy.get(hhAssetsSelector)
      .invoke('val')
      .should('equal', '$' + String(hhAssetsNewValue.float.toFixed(2)))
  })
})
