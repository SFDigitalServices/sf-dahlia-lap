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

  // Wait for the page to reload after the status modal submit
  await page.waitForNavigation()

  // The latest status in the status history should be the status
  // that was just selected and saved
  const latestStatus = await page.$eval('.status-list .status-list_item:last-child .status-list_tag', e => e.textContent)
  expect(latestStatus).toBe(newSelectedStatus)

  // The latest comment in the status history should be the comment
  // that was just entered and saved
  const latestComment = await page.$eval('.status-list .status-list_item:last-child .status-list_note', e => e.textContent)
  expect(latestComment).toBe(COMMENT)
}

const generateRandomCurrency = () => {
  // Round to the nearest hundredth, then convert back to float.
  const val = Number.parseFloat((Math.random() * 1000).toFixed(2))
  // TODO We could improve this by adding commas to the currency string too.
  return {'currency': `$${val}`, 'float': val}
}

const savePage = async (page) => {
  const selector = '#save-supplemental-application'
  // To allow waitForNavigation to work post-save, we need to scroll
  //   down to the save button, then wait for the url to update to the scrollable anchor
  // FIXME this will cause issues if we use savePage when we're already at the
  //   anchor #status-history-section
  await page.focus(selector)
  await page.waitForNavigation()

  await page.click(selector)
}

export default {
  generateRandomCurrency,
  savePage,
  testStatusModalUpdate
}
