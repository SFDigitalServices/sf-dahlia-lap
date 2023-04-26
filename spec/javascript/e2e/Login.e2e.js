import { DEFAULT_E2E_TIME_OUT } from '../support/puppeteer/consts'
import sharedSteps from '../support/puppeteer/steps/sharedSteps'
import SetupBrowserAndPage from '../utils/SetupBrowserAndPage'
let testBrowser

describe('Login/Logout', () => {
  test(
    'lead header loads correctly',
    async () => {
      const { browser, page } = await SetupBrowserAndPage()
      testBrowser = browser

      await page.goto('http://localhost:3000/')
      await page.waitForSelector('#root')

      const html = await page.$eval('.lead-header_title', (e) => e.innerHTML)
      expect(html).toBe('Welcome to DAHLIA Partners.')
    },
    DEFAULT_E2E_TIME_OUT
  )

  test(
    'should sign out successfully',
    async () => {
      const { page } = await SetupBrowserAndPage(testBrowser)

      await sharedSteps.loginAsAgent(page)

      await page.goto('http://localhost:3000/')
      await page.waitForSelector('#root')
      // Click sign-out
      await page.click('#sign-out')
      await page.waitForSelector('#root')

      const html = await page.$eval('.lead-header_title', (e) => e.innerHTML)
      expect(html).toBe('Welcome to DAHLIA Partners.')

      await testBrowser.close()
    },
    DEFAULT_E2E_TIME_OUT
  )
})
