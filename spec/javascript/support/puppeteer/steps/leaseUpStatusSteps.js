import sharedSteps from './sharedSteps'

export const openStatusModalSelector = '.form-modal_form_wrapper'

export const commentInputSelector = '#status-comment'

export const submitStatusModalSelector = '.form-modal_form_wrapper button.primary'

export const unselectedStatusMenuItem = 'li[aria-selected="false"].dropdown-menu_item > a'
export const selectStatusDropdownValue = async (page, dropdownSelector, valueSelector) => {
  await page.click(dropdownSelector)
  await page.waitForSelector('li.dropdown-menu_item')
  await page.click(valueSelector)
  await page.waitForSelector(openStatusModalSelector)
}

export const selectSubstatusIfRequired = async (selectedStatus, page) => {
  if (
    selectedStatus.toLowerCase() !== 'processing' &&
    selectedStatus.toLowerCase() !== 'lease signed'
  ) {
    // If status has a subStatus value wait for that dropdown to be available and select one
    await page.waitForSelector('.form-modal_form_wrapper .substatus-dropdown__control')
    await page.click('.form-modal_form_wrapper .substatus-dropdown__control button')
    const emptySubStatus = await page.$eval(
      '.form-modal_form_wrapper .substatus-dropdown__control button',
      (e) => e.textContent
    )
    expect(emptySubStatus.toLowerCase()).toContain('select one...')
    await page.waitForSelector('.form-modal_form_wrapper .substatus-dropdown__menu')
    await page.click('.form-modal_form_wrapper .substatus-dropdown__menu li a')
    const selectedSubStatus = await getStatusInModal(page)
    expect(selectedSubStatus.toLowerCase()).not.toContain('select one...')
    return selectedSubStatus
  }
}

export const getStatusInModal = async (page) =>
  sharedSteps.getText(page, '.form-modal_form_wrapper .status-dropdown__control button')

export const fillOutAndSubmitStatusModal = async (page, isCommentModal = false) => {
  if (!isCommentModal) {
    const statusInModal = await getStatusInModal(page)
    await selectSubstatusIfRequired(statusInModal, page)
  }
  await page.type(commentInputSelector, 'some comment')
  await page.click(submitStatusModalSelector)
}

export const checkForStatusUpdateSuccess = async (page, applicationId = null) => {
  await page.waitForResponse((response) => {
    if (response.url().includes(`${applicationId || ''}/field_update_comments`)) {
      if (response.status() !== 200) {
        const responseBody = response.json()
        console.error('Status update failure response: ', responseBody)
      }
      expect(response.status()).toBe(200)
      return true
    }
  })
}
