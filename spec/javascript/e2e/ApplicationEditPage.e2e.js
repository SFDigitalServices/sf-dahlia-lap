import { DEFAULT_E2E_TIME_OUT, LEASE_UP_LISTING_APPLICATION_ID } from '../support/puppeteer/consts'
import { applicationRedirectRouteCheck } from '../support/puppeteer/steps/applications'

describe('ApplicationEditPage', () => {
  test(
    'should redirect edit application when lottery_status is anything other than "Not Yet Run"',
    async () => {
      await applicationRedirectRouteCheck('edit', LEASE_UP_LISTING_APPLICATION_ID)
    },
    DEFAULT_E2E_TIME_OUT
  )
})
