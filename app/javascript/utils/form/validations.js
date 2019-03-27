import moment from 'moment'
import { compact, first, isNil, isString, mapValues, map } from 'lodash'
import { API_DATE_FORMAT } from '~/utils/utils'

const run = (rules, values, ifRules) => {
  return mapValues(rules, (valFn, key) => {
    if (ifRules && ifRules[key]) {
      return ifRules[key](values) ? valFn(values[key]) : null
    } else {
      return valFn(values[key])
    }
  })
}

const validate = (rules, ifRules = null) => {
  return values => {
    return run(rules, values, ifRules)
  }
}

/* Validations */

const validates = (fun, message) => (value) => {
  return fun(value) ? null : message
}

const decorateValidator = fn => message => validates(fn, message)

const isOldEnough = (dateOfBirth) => {
  if (dateOfBirth && isValidDate(dateOfBirth)) {
    const years = moment().diff(moment(dateOfBirth.join('-'), API_DATE_FORMAT), 'years')
    return years >= 18
  } else {
    return false
  }
}

const isValidDate = (dateOfBirth) => {
  if (dateOfBirth) {
    // Verify that the year is in a valid range
    if (dateOfBirth[0] < 1900) return false
    // Check that the date is valid and not in the future
    const dobString = dateOfBirth.join('-')
    return moment(dobString, 'YYYY-M-D', true).isValid() && (moment().diff(dobString, 'days') > 0)
  }
}

const isValidEmail = (email) => {
  let emailRegex = new RegExp([
    "[a-zA-Z0-9!%&'*+\\/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!%&'*+\\/=?^_`{|}~-]+)*",
    '@',
    '(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?'
  ].join(''))
  if (email) {
    return emailRegex.test(email)
  }
}

const isValidCurrency = (value) => {
  if (isNil(value)) {
    return true
  } else {
    return !(/[^0-9$,.]/.test(value))
  }
}

const isUnderMaxValue = maxValue => value => {
  if (isNil(value) || value === '') {
    return true
  }
  let incomeFloat = isString(value) ? parseFloat(value.replace(/[$,]+/g, '')) : value
  if (Number.isNaN(incomeFloat)) {
    return false
  }
  if (incomeFloat < maxValue) {
    return true
  }
  return false
}

const isPresent = (value) => !!value

validate.isValidEmail = decorateValidator(isValidEmail)
validate.isOldEnough = decorateValidator(isOldEnough)
validate.isValidDate = decorateValidator(isValidDate)
validate.isValidCurrency = decorateValidator(isValidCurrency)
validate.isUnderMaxValue = (maxVal) => decorateValidator(isUnderMaxValue(maxVal))
validate.isPresent = decorateValidator(isPresent)
validate.list = (fn) => (list) => map(list, fn)
validate.any = (...fns) => (value) => {
  return first(
    compact(
      map(fns, fn => fn(value))))
}

export default validate
