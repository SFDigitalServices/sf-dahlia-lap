import puppeteer from 'puppeteer'

import sharedSteps from './sharedSteps'
import { HEADLESS } from '../consts'

export const applicationRouteCheck = async (type, id) => {
  let browser = await puppeteer.launch({ headless: HEADLESS })
  let page = await browser.newPage()
  const fullURL = type === 'new' ? `/listings/${id}/applications/new` : `/applications/${id}/edit`
  const resultURL = type === 'new' ? `listings/${id}` : `applications/${id}`

  await sharedSteps.loginAsAgent(page)
  await sharedSteps.goto(page, fullURL)
  await page.waitFor(2000)

  const currentUrl = page.url()
  expect(currentUrl).toContain(`http://localhost:3000/${resultURL}`)
  expect(currentUrl).not.toContain(`edit`)

  await browser.close()
}
