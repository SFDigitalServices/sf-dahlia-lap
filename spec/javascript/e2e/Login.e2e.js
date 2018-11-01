import puppeteer from 'puppeteer'
import { HEADLESS } from '../support/puppeteer/consts'

describe('Lead header', () => {
  test('lead header loads correctly', async () => {
    let browser = await puppeteer.launch({
      headless: HEADLESS
    })
    let page = await browser.newPage()

    await page.goto('http://localhost:3000/')
    await page.waitForSelector('#root')

    const html = await page.$eval('.lead-header_title', e => e.innerHTML)
    expect(html).toBe('Welcome to the Leasing Agent Portal.')

    await browser.close()
  }, 16000)
})
