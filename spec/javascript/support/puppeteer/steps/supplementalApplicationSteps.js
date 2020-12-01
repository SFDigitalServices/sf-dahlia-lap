import {
  selectSubstatusIfRequired,
  checkForStatusUpdateSuccess,
  commentInputSelector,
  openStatusModalSelector,
  submitStatusModalSelector,
  unselectedStatusMenuItem
} from './leaseUpStatusSteps'
import sharedSteps from './sharedSteps'

const testStatusModalUpdate = async (page) => {
  const COMMENT = 'This is a comment.'
  // Wait for the status modal to appear
  await page.waitForSelector(openStatusModalSelector)

  // Select a status different from the current one in the status modal
  await page.click('.form-modal_form_wrapper .dropdown')
  const unselectedStatusSelector = '.form-modal_form_wrapper ' + unselectedStatusMenuItem
  const newSelectedStatus = await sharedSteps.getText(page, unselectedStatusSelector)
  await page.click(unselectedStatusSelector)

  await selectSubstatusIfRequired(newSelectedStatus, page)

  // Enter a comment into the status modal comment field
  await page.type(commentInputSelector, COMMENT)
  // Submit the status modal form
  await page.click(submitStatusModalSelector)
  // Verify that no form-field errors are present on save
  expect(await sharedSteps.getFormErrors(page)).toStrictEqual([])

  // Verify that the response from salesforce was a success
  await checkForStatusUpdateSuccess(page)

  // wait for modal overlay to be hidden after submit
  await page.waitForSelector('.ReactModal__Overlay.ReactModal__Overlay--after-open', {
    hidden: true
  })
  // The latest status in the status history should be the status that was just selected and saved
  const latestStatus = await page.$eval(
    '.status-items .status-item:first-child .status-pill',
    (e) => e.textContent
  )
  expect(latestStatus).toBe(newSelectedStatus)

  // The latest comment in the status history should be the comment that was just entered and saved
  const latestComment = await page.$eval(
    '.status-items .status-item:first-child .status-item-text',
    (e) => e.textContent
  )
  expect(latestComment).toBe(COMMENT)
}

const generateRandomCurrency = () => {
  // Round to the nearest hundredth, then convert back to float.
  const val = Number.parseFloat((Math.random() * 1000).toFixed(2))
  // TODO We could improve this by adding commas to the currency string too.
  return { currency: `$${val}`, float: val }
}

const savePage = async (page) => {
  const selector = '#save-supplemental-application'
  await page.click(selector)
}

export default {
  generateRandomCurrency,
  savePage,
  testStatusModalUpdate
}
