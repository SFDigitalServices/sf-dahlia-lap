import puppeteer from 'puppeteer'

describe('Lead header', () => {
  test('lead header loads correctly', async () => {
    let browser = await puppeteer.launch({
      headless: true // change this to false to launch a browser
    })
    let page = await browser.newPage()

    await page.goto('http://localhost:3000/')
    await page.waitForSelector('#root')

    const html = await page.$eval('.lead-header_title', e => e.innerHTML)
    expect(html).toBe('Welcome to the Leasing Agent Portal.')

    browser.close()
  }, 16000)
})
