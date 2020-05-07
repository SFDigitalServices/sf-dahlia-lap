import { DEFAULT_E2E_TIME_OUT } from '../support/puppeteer/consts'
import puppeteer from 'puppeteer'

describe('CircleCI Test', () => {
  test('lead header loads correctly', async () => {
    let browser = await puppeteer.launch({ headless: true })

    console.log('browser', browser)
    let version = await browser.version()
    console.log('browser version', version)
    let page = await browser.newPage()
    await page.goto('http://google.com')
    let content = await page.content()
    console.log('google page content', content)
    let googleFooter = await page.$eval('div.gb_1f', e => e.textContent)
    console.log('google page content', googleFooter)
    expect(googleFooter).toBe('Google\'s page content')
    await page.goto('http://localhost:3000/')
    await page.waitForSelector('#root')

    const html = await page.$eval('.lead-header_title', e => e.innerHTML)
    expect(html).toBe('Welcome to DAHLIA Partners.')
  }, DEFAULT_E2E_TIME_OUT)
})
