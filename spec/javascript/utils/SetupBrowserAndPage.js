import puppeteer from 'puppeteer'
import { HEADLESS as headless, REMOVECSS } from '../support/puppeteer/consts'

const IgnoreImageAndCSSLoad = async (page) => {
  await page.setRequestInterception(true)

  page.on('request', (req) => {
    if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image') {
      return req.abort()
    }
    return req.continue()
  })

  return page
}

const SetupBrowser = async () => {
  let browser = await puppeteer.launch({ headless })
  return browser
}

const SetupBrowserAndPage = async (testBrowser, withCSS = false) => {
  let browser = testBrowser
  if (!browser) {
    browser = await SetupBrowser()
  }
  let page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  // This allows for overriding by individual suites or overall
  if (!withCSS && REMOVECSS) {
    page = await IgnoreImageAndCSSLoad(page)
  }
  return { browser, page }
}

export default SetupBrowserAndPage