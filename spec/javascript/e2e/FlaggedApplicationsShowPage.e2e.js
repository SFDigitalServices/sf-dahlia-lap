import puppeteer from 'puppeteer'

import utils from '../support/puppeteer/utils'
import sharedSteps from '../support/puppeteer/steps/sharedSteps'
import {
  FLAGGED_RECORD_SET_ID,
  DEFAULT_E2E_TIME_OUT,
  HEADLESS
} from '../support/puppeteer/consts'

describe('FlaggedApplicationsShowPage', () => {
  test('should allow comments to be updated', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/flagged/${FLAGGED_RECORD_SET_ID}`)

    const commentInputSelector = 'input[type="text"]'
    const sampleComment = 'Test Commment'
    const openRowSelector = '.rt-expander.-open'

    // Open up a row
    await page.click('.rt-expander')
    let hasCommentInput = await utils.isPresent(page, commentInputSelector)
    expect(hasCommentInput).toBe(true)

    let hasOpenRow = await utils.isPresent(page, openRowSelector)
    expect(hasOpenRow).toBe(true)

    // Type
    await sharedSteps.enterValue(page, commentInputSelector, sampleComment)

    // Verify that it's been typed
    let value = await sharedSteps.getValue(page, commentInputSelector)
    expect(value).toEqual(sampleComment)

    // Save the change
    const saveButtonList = await page.$x("//button[contains(text(), 'Save Changes')]")
    await saveButtonList[0].click()

    // Expect the row to be closed
    await page.waitFor(() => !document.querySelector('.rt-expander.-open'))
    hasOpenRow = await utils.isPresent(page, openRowSelector)
    expect(hasOpenRow).toBe(false)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
