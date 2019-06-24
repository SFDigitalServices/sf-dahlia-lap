import utils from '../utils'

const testStatusModalUpdate = async (page) => {
  const COMMENT = 'This is a comment.'
  // Wait for the status modal to appear
  await page.waitForSelector('.form-modal_form_wrapper')

  // Select a status different from the current one in the status modal
  await page.click('.form-modal_form_wrapper .dropdown')
  const newSelectedStatus = await page.$eval('.form-modal_form_wrapper .dropdown-menu li[aria-selected="false"] a', e => e.textContent)
  await page.click('.form-modal_form_wrapper .dropdown-menu li[aria-selected="false"] a')

  let selectedSubstatus = await checkForSubStatus(newSelectedStatus, page)

  // Enter a comment into the status modal comment field
  await page.type('#status-comment', COMMENT)
  // Submit the status modal form
  await page.click('.form-modal_form_wrapper button.primary')

  // Verify that no form-field errors are present on save
  const errors = await page.$$eval('span.error', divs => divs.map(d => d.textContent))
  expect(errors).toStrictEqual([])
  // Verify that no salesforce save errors present on save
  try {
    await page.waitForSelector('.alert-body', { timeout: 30000 })
    console.error('There has been a problem saving the status modal')
    console.error('Selected status: ', newSelectedStatus, 'Selected substatus:', selectedSubstatus)
    const hasAlertBox = await utils.isPresent(page, '.alert-body')
    expect(hasAlertBox).toBe(false)
  } catch (error) {
    console.log('error: ', error)
    console.log('error message: ', error.message)
    if (error.message.includes('expect(received).toBe(expected)')) {
      console.log('caught the expect error')
      throw error
    }
  }

  // Wait for the page to reload after the status modal submit
  await page.waitForNavigation()

  // The latest status in the status history should be the status that was just selected and saved
  const latestStatus = await page.$eval('.status-list .status-list_item:last-child .status-list_tag', e => e.textContent)
  expect(latestStatus).toBe(newSelectedStatus)

  // The latest comment in the status history should be the comment that was just entered and saved
  let latestComment = ''
  try {
    await page.waitForSelector('.status-list .status-list_item:last-child .status-list_note:last-child')
    latestComment = await page.$eval('.status-list .status-list_item:last-child .status-list_note:last-child', e => e.textContent)
  } catch (err) {
    latestComment = await page.$eval('.status-list .status-list_item:last-child .status-list_note:first-child', e => e.textContent)
  }
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

const checkForSubStatus = async (selectedStatus, page) => {
  if (selectedStatus.toLowerCase() !== 'processing' && selectedStatus.toLowerCase() !== 'lease signed') {
    // If status has a subStatus value wait for that dropdown to be available and select one
    await page.waitForSelector('.form-modal_form_wrapper .dropdown.subStatus')
    await page.click('.form-modal_form_wrapper .dropdown.subStatus button')
    const emptySubStatus = await page.$eval('.form-modal_form_wrapper .dropdown.subStatus button', e => e.textContent)
    expect(emptySubStatus.toLowerCase().includes('select one...')).toBe(true)

    await page.waitForSelector('.form-modal_form_wrapper .dropdown.subStatus .dropdown-menu')
    await page.click('.form-modal_form_wrapper .dropdown.subStatus .dropdown-menu li a')
    const selectedSubStatus = await page.$eval('.form-modal_form_wrapper .dropdown.subStatus button', e => e.textContent)
    expect(selectedSubStatus.toLowerCase().includes('select one...')).toBe(false)
    return selectedSubStatus
  }
}

export default {
  generateRandomCurrency,
  savePage,
  testStatusModalUpdate,
  checkForSubStatus
}
