import sharedSteps from './sharedSteps'
import SetupBrowserAndPage from '../../../utils/SetupBrowserAndPage'

/**
 * function applicationRedirectRouteCheck
 *
 * This is a helper that allows us to check the redirect
 * logic for edit and new application functionality
 *
 * @param {string} type - edit or new to indicate what action the user is taking on an application
 * @param {string} id  - application id to edit or listing id to create an application off of
 */
export const applicationRedirectRouteCheck = async (type, id, testBrowser) => {
  const { browser, page } = await SetupBrowserAndPage(testBrowser)

  const fullURL = type === 'new' ? `/listings/${id}/applications/new` : `/applications/${id}/edit`
  const resultURL = type === 'new' ? `listings/${id}` : `applications/${id}`

  if (!testBrowser) {
    await sharedSteps.loginAsAgent(page)
  }
  await sharedSteps.goto(page, fullURL)
  await page.waitForTimeout(2000)

  const currentUrl = page.url()
  expect(currentUrl).toContain(`http://localhost:3000/${resultURL}`)
  expect(currentUrl).not.toContain(type)

  await browser.close()
}
