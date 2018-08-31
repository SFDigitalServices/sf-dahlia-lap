import puppeteer from 'puppeteer'
import steps from '../support/puppeteerSteps'

describe('Lead header', () => {
  test('lead header loads correctly', async () => {
	let browser = await puppeteer.launch({
	  headless: false // change this to false to launch a browser
	});
	let page = await browser.newPage();

  await steps.loginAsAgent(page)
  await steps.goto(page, '/listings/a0W0P00000DZfSpUAL/applications/new')

  await page.type('#first_name', 'Some first name')
  await page.type('#last_name', 'Some last name')
  await page.type('#date_of_birth', '03/03/1983')
  await page.click('.save-btn')
  await page.waitForNavigation()

  // browser.close();
}, 160000);
});
