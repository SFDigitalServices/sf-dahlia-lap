import { FLAGGED_RECORD_SET_ID } from '../support/consts'
import { notSelectedOptionSelector, usingFixtures } from '../support/utils'

const commentInputSelector = 'input[type="text"]'
const openRowSelector = '.rt-expander.-open'
const statusInputSelector = 'select'

describe('FlaggedApplicationsShowPage', () => {
  beforeEach(() => {
    if (usingFixtures()) {
      cy.intercept('api/v1/flagged-applications/record-set/*', {
        fixture: 'flaggedRecordSet.json'
      }).as('flaggedRecordSet')
      cy.intercept('api/v1/flagged-applications/update', {
        fixture: 'flaggedRecordSetUpdate.json'
      }).as('updateCall')
    } else {
      cy.intercept('api/v1/flagged-applications/update').as('updateCall')
      cy.intercept('api/v1/flagged-applications/record-set/*').as('flaggedRecordSet')
    }
  })

  it('should allow comments to be updated', () => {
    let newStatus

    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/applications/flagged/${FLAGGED_RECORD_SET_ID}`)
    cy.wait('@flaggedRecordSet')

    const updateComment = 'this is a comment'

    cy.get('div[role="rowgroup"]')
      .first()
      .within(() => {
        // Open up a row
        cy.get('.rt-expander').click()
        cy.get(openRowSelector).should('exist')

        // Type a comment and verify that it's been typed
        cy.get(commentInputSelector).clear().type(updateComment)

        // Update the comment status
        cy.getInputValue(notSelectedOptionSelector(statusInputSelector)).then((val) => {
          newStatus = val
          cy.get(statusInputSelector).select(val)
        })

        // Save the change
        cy.contains('button', 'Save Changes').click()
        cy.wait('@updateCall')

        // Expect the row to be closed
        cy.get(openRowSelector).should('not.exist')
      })

    if (usingFixtures()) {
      cy.intercept('api/v1/flagged-applications/record-set/*', {
        fixture: 'flaggedRecordSetUpdated.json'
      }).as('flaggedRecordSet')
    } else {
      cy.intercept('api/v1/flagged-applications/record-set/*').as('flaggedRecordSet')
    }
    cy.reload()
    cy.wait('@flaggedRecordSet')

    cy.get('div[role="rowgroup"]')
      .first()
      .within(() => {
        cy.contains(updateComment)
        cy.contains(newStatus)
      })
  })
})
