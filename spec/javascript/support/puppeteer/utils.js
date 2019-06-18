import { FIRST_NAME, LAST_NAME, DOB_MONTH, DOB_DAY, DOB_YEAR, DECLINE_TO_STATE } from './consts'

const count = async (page, selector) => {
  return page.$$eval(selector, elements => elements.length)
}

const isPresent = async (page, selector) => {
  const c = await count(page, selector)
  return c > 0
}

const blurValidation = (page, selector) => page.evaluate((selector) => {
  if (selector) {
    const domSelector = document.querySelector(selector)
    domSelector.focus()
    return domSelector.blur()
  } else {
    document.querySelector('input').blur()
    return document.querySelector('select').blur()
  }
}, selector)

const fillOutRequiredFields = async (page) => {
  await page.select('#application_language', 'English')
  await page.type('#first_name', FIRST_NAME)
  await page.type('#last_name', LAST_NAME)
  await page.type('#date_of_birth_month', DOB_MONTH)
  await page.type('#date_of_birth_day', DOB_DAY)
  await page.type('#date_of_birth_year', DOB_YEAR)

  // Demographics section fields
  await page.select('select[name="demographics.ethnicity"]', DECLINE_TO_STATE)
  await page.select('select[name="demographics.race"]', DECLINE_TO_STATE)
  await page.select('select[name="demographics.gender"]', DECLINE_TO_STATE)
  await page.select('select[name="demographics.sexual_orientation"]', DECLINE_TO_STATE)

  // Signature on Terms of Agreement
  await page.click('input[name="terms_acknowledged"]')
}

export default {
  count,
  isPresent,
  blurValidation,
  fillOutRequiredFields
}
