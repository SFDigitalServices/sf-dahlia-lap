import puppeteer from 'puppeteer'
import { HEADLESS, DEFAULT_E2E_TIME_OUT } from '../support/puppeteer/consts'
import sharedSteps from '../support/puppeteer/steps/sharedSteps'

let browser

describe('Login/Logout', () => {
  test('lead header loads correctly', async () => {
    browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await page.goto('http://localhost:3000/')
    await page.waitForSelector('#root')

    const html = await page.$eval('.lead-header_title', e => e.innerHTML)
    expect(html).toBe('Welcome to DAHLIA Partners.')

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)

  test('should sign out successfully', async () => {
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)

    await page.goto('http://localhost:3000/')
    await page.waitForSelector('#root')
    // Click sign-out
    await page.click('#sign-out')
    await page.waitForSelector('#root')

    const html = await page.$eval('.lead-header_title', e => e.innerHTML)
    expect(html).toBe('Welcome to DAHLIA Partners.')

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
