import { DEFAULT_E2E_TIME_OUT } from '../support/puppeteer/consts'
import puppeteer from 'puppeteer'

describe('CircleCI Test', () => {
  test('lead header loads correctly', async () => {
    let browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    let page = await browser.newPage()

    await page.goto('http://localhost:3000/')
    await page.waitForSelector('#root')

    const html = await page.$eval('.lead-header_title', e => e.innerHTML)
    expect(html).toBe('Welcome to DAHLIA Partners.')

    // Sign in
    const navigationPromise = page.waitForNavigation()
    // Clicking the link will indirectly cause a navigation
    await page.click('.sign-in-btn')
    // The navigationPromise resolves after navigation has finished
    await navigationPromise
    let loginUrl = await page.url()
    console.log('login page url', loginUrl)
    let loginPageContent = await page.content()

    // Salesforce login
    await page.waitForSelector('#username_container')
    await page.type('#username', process.env.E2E_SALESFORCE_USERNAME)
    await page.type('#password', process.env.E2E_SALESFORCE_PASSWORD)
    await page.click('#Login')

    await page.waitForNavigation()

    loginUrl = await page.url()
    console.log('login page url after 2nd wait for navigation', loginUrl)
    loginPageContent = await page.content()
    console.log('login page content after 2nd wait for navigation', loginPageContent)
    await page.waitForSelector('#root')
  }, DEFAULT_E2E_TIME_OUT)
})
