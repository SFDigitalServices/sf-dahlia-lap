import puppeteer from 'puppeteer'

describe('Lead header', () => {
  test('lead header loads correctly', async () => {
	let browser = await puppeteer.launch({
	  headless: true // change this to false to launch a browser
	});
	let page = await browser.newPage();

	await page.goto('http://localhost:3000/');
	await page.waitForSelector('#root');

  // Sign in
  await page.click('.sign-in-btn')
  await page.waitForNavigation()

  // Sale force login
  await page.type('#username', process.env.E2E_SALEFORCE_USERNAME)
  await page.type('#password', process.env.E2E_SALEFORCE_PASSWORD)
  await page.click('#Login')
  await page.waitForNavigation()

  // Got to a lease up applications
  await page.waitForSelector('#root')

  await page.goto('http://localhost:3000/listings/lease-ups/a0W0P00000DZfSpUAL/applications')
  await page.waitForSelector('#root')
  await page.waitForSelector('.dropdown')

  const previousStatus = await page.$eval('.rt-tr-group:first-child .rt-td .dropdown .dropdown-button', e => e.textContent);

  // Change status
  await page.click('.rt-tr-group:first-child .rt-td .dropdown')
  await page.click('.dropdown-menu li[aria-selected="false"] a:first-child')

  await page.waitForSelector('.form-modal_form_wrapper')
  await page.type('#status-comment', 'some comment')
  await page.click('.form-modal_form_wrapper button.primary')

  await page.waitForResponse('http://localhost:3000/api/v1/field-update-comments/create')

  const currentStatus = await page.$eval('.rt-tr-group:first-child .rt-td .dropdown .dropdown-button', e => e.textContent)

  expect(previousStatus).not.toBe(currentStatus);

	browser.close();
}, 160000);
});
