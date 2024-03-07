import { FLAGGED_RECORD_SET_ID } from '../support/consts'
import { generateRandomString, notSelectedOptionSelector } from '../support/utils'

const commentInputSelector = 'input[type="text"]'
const openRowSelector = '.rt-expander.-open'
const statusInputSelector = 'select'


// describe('FlaggedApplicationsIndexPage', () => {
//   // once we have fixtures, we can intercept these API endpoints:
//   // cy.intercept("api/v1/flagged-applications?type=pending", { fixture: "foobar" }).as("pendingFlaggedRecordsWithTitle")
//   // cy.intercept("api/v1/flagged-applications?type=duplicated)", { fixture: "foobar" }).as("duplicatedFlaggedRecordsWithTitle")
// })

describe('FlaggedApplicationsShowPage', () => {
  // once we have fixtures, we can intercept this API endpoint:
  // cy.intercept("api/v1/flagged-applications/record-set/*", { fixture: "foobar" }).as("flaggedRecordSet")

  it('should allow comments to be updated', () => {
    let newStatus

    cy.visit('http://localhost:3000/')
    cy.login()
    cy.visit(`/applications/flagged/${FLAGGED_RECORD_SET_ID}`)

    const randomString = generateRandomString(10)

    cy.get('div[role="rowgroup"]')
      .first()
      .within(() => {
        // Open up a row
        cy.get('.rt-expander').click()
        cy.get(openRowSelector).should('exist')

        // Type a comment and verify that it's been typed
        cy.get(commentInputSelector).clear().type(randomString)

        // Update the comment status
        cy.getInputValue(notSelectedOptionSelector(statusInputSelector)).then((val) => {
          newStatus = val
          cy.get(statusInputSelector).select(val)
        })

        // Save the change
        cy.contains('button', 'Save Changes').click()
        cy.wait(2000)

        // Expect the row to be closed
        cy.get(openRowSelector).should('not.exist')
      })

    cy.reload()

    cy.get('div[role="rowgroup"]')
      .first()
      .within(() => {
        cy.contains(randomString)
        cy.contains(newStatus)
      })
  })
})
