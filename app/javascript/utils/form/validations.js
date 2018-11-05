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
    return true
  }
}

const isValidDate = (dateOfBirth) => {
  if (dateOfBirth) {
    dateOfBirth = dateOfBirth.join('-')
    // Check that the date is valid and not in the future
    return moment(dateOfBirth, 'YYYY-MM-DD').isValid() && (moment().diff(dateOfBirth, 'days') > 0)
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
