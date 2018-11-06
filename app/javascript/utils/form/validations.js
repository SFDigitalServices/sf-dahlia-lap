import moment from 'moment'
import { mapValues, map, first, compact } from 'lodash'

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
    const years = moment().diff(moment(dateOfBirth.join('-'), 'YYYY-MM-DD'), 'years')
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
    return moment(dobString, 'YYYY-MM-DD', true).isValid() && (moment().diff(dobString, 'days') > 0)
  }
}

const isPresent = (value) => !!value

validate.isOldEnough = decorateValidator(isOldEnough)
validate.isValidDate = decorateValidator(isValidDate)
validate.isPresent = decorateValidator(isPresent)
validate.list = (fn) => (list) => map(list, fn)
validate.any = (...fns) => (value) => {
  return first(
    compact(
      map(fns, fn => fn(value))))
}

export default validate
