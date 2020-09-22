import sharedSteps from './sharedSteps'

const testStatusModalUpdate = async (page) => {
  const COMMENT = 'This is a comment.'
  // Wait for the status modal to appear
  await page.waitForSelector('.form-modal_form_wrapper')

  // Select a status different from the current one in the status modal
  await page.click('.form-modal_form_wrapper .dropdown')
  const newSelectedStatus = await page.$eval('.form-modal_form_wrapper li[aria-selected="false"].dropdown-menu_item  a', e => e.textContent)
  await page.click('.form-modal_form_wrapper li[aria-selected="false"].dropdown-menu_item  a')

  const selectedSubstatus = await checkForSubStatus(newSelectedStatus, page)

  // Enter a comment into the status modal comment field
  await page.type('#status-comment', COMMENT)
  // Submit the status modal form
  await page.click('.form-modal_form_wrapper button.primary')
  // Verify that no form-field errors are present on save
  expect(await sharedSteps.getFormErrors(page)).toStrictEqual([])

  // Verify that the response from salesforce was a success
  await page.on('response', async (response) => {
    if (response.url().includes('/field-update-comments/create')) {
      if (response.status() !== 200) {
        const responseBody = await response.json()
        console.error('Status update failure response: ', responseBody)
        console.error('Selected status: ', newSelectedStatus, ', Selected substatus:', selectedSubstatus)
      }
      expect(response.status()).toBe(200)
    }
  })
  // wait for modal overlay to be hidden after submit
  await page.waitForSelector('.ReactModal__Overlay.ReactModal__Overlay--after-open', { hidden: true })
  // The latest status in the status history should be the status that was just selected and saved
  const latestStatus = await page.$eval('.status-items .status-item:first-child .status-pill', e => e.textContent)
  expect(latestStatus).toBe(newSelectedStatus)

  // The latest comment in the status history should be the comment that was just entered and saved
  const latestComment = await page.$eval('.status-items .status-item:first-child .status-item-text', e => e.textContent)
  expect(latestComment).toBe(COMMENT)
}

const generateRandomCurrency = () => {
  // Round to the nearest hundredth, then convert back to float.
  const val = Number.parseFloat((Math.random() * 1000).toFixed(2))
  // TODO We could improve this by adding commas to the currency string too.
  return { 'currency': `$${val}`, 'float': val }
}

const savePage = async (page) => {
  const selector = '#save-supplemental-application'
  await page.click(selector)
}

const checkForSubStatus = async (selectedStatus, page) => {
  if (selectedStatus.toLowerCase() !== 'processing' && selectedStatus.toLowerCase() !== 'lease signed') {
    // If status has a subStatus value wait for that dropdown to be available and select one
    await page.waitForSelector('.form-modal_form_wrapper .substatus-dropdown__control')
    await page.click('.form-modal_form_wrapper .substatus-dropdown__control button')
    const emptySubStatus = await page.$eval('.form-modal_form_wrapper .substatus-dropdown__control button', e => e.textContent)
    expect(emptySubStatus.toLowerCase().includes('select one...')).toBe(true)
    await page.waitForSelector('.form-modal_form_wrapper .substatus-dropdown__menu')
    await page.click('.form-modal_form_wrapper .substatus-dropdown__menu li a')
    const selectedSubStatus = await page.$eval('.form-modal_form_wrapper .substatus-dropdown__control button', e => e.textContent)
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
