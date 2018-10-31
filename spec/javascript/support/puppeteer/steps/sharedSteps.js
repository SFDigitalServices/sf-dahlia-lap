const HOST = 'http://localhost:3000'

const loginAsAgent = async (page) => {
  await page.goto('http://localhost:3000/')
  await page.waitForSelector('#root')

  // Sign in
  await page.click('.sign-in-btn')
  await page.waitForNavigation()

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

export default {
  loginAsAgent,
  goto,
  waitForApp
}
