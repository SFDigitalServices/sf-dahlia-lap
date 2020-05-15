const HOST = 'http://localhost:3000'

const loginAsAgent = async (page) => {
  await page.goto('http://localhost:3000/')
  await page.waitForSelector('#root')

  // Sign in
  const navigationPromise = page.waitForNavigation()
  // Clicking the link will indirectly cause a navigation
  await page.click('.sign-in-btn')
  // The navigationPromise resolves after navigation has finished
  await navigationPromise

  // Salesforce login
  await page.waitForSelector('#username_container')
  await page.type('#username', process.env.E2E_SALESFORCE_USERNAME)
  await page.type('#password', process.env.E2E_SALESFORCE_PASSWORD)
  await page.click('#Login')

  await page.waitForNavigation()
  await page.waitForSelector('#root')
}

const goto = async (page, path) => {
  await page.goto(`${HOST}${path}`)
  await waitForApp(page)
}

const waitForApp = async (page) => {
  await page.waitForSelector('#root')
}

const enterValue = async (page, selector, value) => {
  // Wait for the field to appear
  await page.waitForSelector(selector)
  // Clear the value that's there. Final form resets field value on enter, so we need to do it 'manually' with backspace.
  await page.focus(selector)
  const inputValue = await page.$eval(selector, el => el.value)
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace')
  }
  // Enter the value
  await page.type(selector, value)
}

const getInputValue = async (page, selector) => {
  await page.waitForSelector(selector)
  const input = await page.$(selector)
  const valueHandle = await input.getProperty('value')
  return valueHandle.jsonValue()
}

const getText = async (page, selector) => {
  await page.waitForSelector(selector)
  return page.$eval(selector, e => e.textContent)
}

const generateRandomString = (length) => {
  // Due to 0s potentially present in the random number,
  // there is a chance that this function could return a string shorter than the desired length.
  // Source: https://stackoverflow.com/a/38622545
  return Math.random().toString(36).substr(2, length)
}

const notSelectedOptionSelector = (fieldSelector) => {
  return `${fieldSelector} option:not(:checked):not(:disabled)`
}

const selectedOptionSelector = (fieldSelector) => {
  return `${fieldSelector} option:checked`
}

const getFormErrors = async (page) => {
  // Return list of errors present on a form
  const errors = await page.$$eval('span.error', divs => divs.map(d => d.textContent))
  return errors
}

export default {
  loginAsAgent,
  goto,
  waitForApp,
  enterValue,
  getInputValue,
  getText,
  generateRandomString,
  notSelectedOptionSelector,
  selectedOptionSelector,
  getFormErrors
}
