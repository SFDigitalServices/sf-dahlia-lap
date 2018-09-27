import utils from '../utils'

const testStatusModalUpdate = async (page) => {
  const COMMENT = 'This is a comment.'

  // Wait for the status modal to appear
  await page.waitForSelector('.form-modal_form_wrapper')

  // Select a status different from the current one in the status modal
  await page.click('.form-modal_form_wrapper .dropdown')
  const newSelectedStatus = await page.$eval('.form-modal_form_wrapper .dropdown-menu li[aria-selected="false"] a', e => e.textContent)
  await page.click('.form-modal_form_wrapper .dropdown-menu li[aria-selected="false"] a')

  // Enter a comment into the status modal comment field
  await page.type('#status-comment', COMMENT)

  // Submit the status modal form
  await page.click('.form-modal_form_wrapper button.primary')

  // The page should enter a loading state while the status modal
  // submit action is in progress
  const pageHasLoadingState = await utils.isPresent(page, '.tabs-card-row > .tabs-card > .loading-panel.loading')
  expect(pageHasLoadingState).toBe(true)

  // Wait for the page to reload after the status modal submit
  await page.waitForSelector('.tabs-card-row > .tabs-card > .loading-panel:not(.loading)')

  // The latest status in the status history should be the status
  // that was just selected and saved
  const latestStatus = await page.$eval('.status-list .status-list_item:last-child .status-list_tag', e => e.textContent)
  expect(latestStatus).toBe(newSelectedStatus)

  // The latest comment in the status history should be the comment
  // that was just entered and saved
  const latestComment = await page.$eval('.status-list .status-list_item:last-child .status-list_note', e => e.textContent)
  expect(latestComment).toBe(COMMENT)
}

export default {
  testStatusModalUpdate
}
