import puppeteer from 'puppeteer'

import utils from '../support/puppeteer/utils'
import sharedSteps from '../support/puppeteer/steps/sharedSteps'
import {
  FLAGGED_RECORD_SET_ID,
  DEFAULT_E2E_TIME_OUT,
  HEADLESS
} from '../support/puppeteer/consts'
import IgnoreImageAndCSSLoad from '../utils/IgnoreAssets'

describe('FlaggedApplicationsShowPage', () => {
  test('should allow comments to be updated', async () => {
    let browser = await puppeteer.launch({ headless: HEADLESS })
    let page = await browser.newPage()
    IgnoreImageAndCSSLoad(page)

    await sharedSteps.loginAsAgent(page)
    await sharedSteps.goto(page, `/applications/flagged/${FLAGGED_RECORD_SET_ID}`)

    const commentInputSelector = 'input[type="text"]'
    const statusInputSelector = 'select'
    const openRowSelector = '.rt-expander.-open'

    const sampleComment = sharedSteps.generateRandomString(10)

    // Open up a row
    await page.click('.rt-expander')
    expect(await utils.isPresent(page, openRowSelector)).toBe(true)

    // Type a comment and verify that it's been typed
    await sharedSteps.enterValue(page, commentInputSelector, sampleComment)
    expect(await sharedSteps.getInputValue(page, commentInputSelector)).toEqual(sampleComment)

    // Update the comment status
    const newStatus = await sharedSteps.getInputValue(page, sharedSteps.notSelectedOptionSelector(statusInputSelector))
    await page.select(statusInputSelector, newStatus)

    // Save the change
    const saveButtonList = await page.$x("//button[contains(text(), 'Save Changes')]")
    await saveButtonList[0].click()

    // Expect the row to be closed
    await page.waitFor(() => !document.querySelector('.rt-expander.-open'))
    expect(await utils.isPresent(page, openRowSelector)).toBe(false)

    // Refresh the page to make sure the values stuck
    await sharedSteps.goto(page, `/applications/flagged/${FLAGGED_RECORD_SET_ID}`)

    const commentDisplaySelector = 'div.rt-tbody > div:nth-child(1) > div > div:nth-child(7)'
    const savedComment = await sharedSteps.getText(page, commentDisplaySelector)
    expect(savedComment).toEqual(sampleComment)

    const statusDisplaySelector = 'div.rt-tbody > div:nth-child(1) > div > div:nth-child(6)'
    const savedStatus = await sharedSteps.getText(page, statusDisplaySelector)
    expect(savedStatus).toEqual(newStatus)

    await browser.close()
  }, DEFAULT_E2E_TIME_OUT)
})
