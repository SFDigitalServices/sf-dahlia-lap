const LEASE_UP_LISTING_APPLICATION_ID = Cypress.env('LEASE_UP_LISTING_APPLICATION_ID')

describe('ApplicationEditPage', () => {
  it('should redirect edit application when lottery_status is anything other than "Not Yet Run"', () => {
    cy.applicationRedirectRouteCheck('edit', LEASE_UP_LISTING_APPLICATION_ID)
  })
})
