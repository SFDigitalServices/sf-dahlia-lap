import { LEASE_UP_LISTING_APPLICATION_ID } from '../support/consts'

describe('ApplicationEditPage', () => {
  it('should redirect edit application when lottery_status is anything other than "Not Yet Run"', () => {
    cy.applicationRedirectRouteCheck('edit', LEASE_UP_LISTING_APPLICATION_ID)
  })
})
