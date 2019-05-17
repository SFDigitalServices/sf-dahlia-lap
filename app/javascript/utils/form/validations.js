import moment from 'moment'
import { compact, first, isEmpty, isNil, isString, mapValues, map } from 'lodash'
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
  return fun(value) ? undefined : message
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

const isValidDate = (date) => {
  if (date && !isEmpty(compact(date))) {
    // Verify that the year is in a valid range
    if (date[0] < 1900) return false
    // Check that the date is valid
    const dateString = date.join('-')
    return moment(dateString, 'YYYY-M-D', true).isValid()
  } else {
    return true
  }
}

const isValidEmail = (email) => {
  let emailRegex = new RegExp([
    "^[a-zA-Z0-9!%&'*+\\/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!%&'*+\\/=?^_`{|}~-]+)*",
    '@',
    '(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$'
  ].join(''))
  if (email) {
    return emailRegex.test(email)
  }
  return true
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

const isChecked = (value) => {
  return !!value && value !== 'on'
}
const isPresent = (value) => {
  return Array.isArray(value) ? !isEmpty(compact(value)) : !!value
}

validate.isValidEmail = decorateValidator(isValidEmail)
validate.isOldEnough = decorateValidator(isOldEnough)
validate.isValidDate = decorateValidator(isValidDate)
validate.isValidCurrency = decorateValidator(isValidCurrency)
validate.isUnderMaxValue = (maxVal) => decorateValidator(isUnderMaxValue(maxVal))
validate.isPresent = decorateValidator(isPresent)
validate.isChecked = decorateValidator(isChecked)
validate.list = (fn) => (list) => map(list, fn)
validate.any = (...fns) => (value) => {
  return first(
    compact(
      map(fns, fn => fn(value))))
}

validate.isValidDOB = (person, errors, isPrimaryApplicant = false) => {
  let errorMessage = 'Please enter a Date of Birth'
  if (person && person.date_of_birth) {
    let DOB = [person.date_of_birth.year, person.date_of_birth.month, person.date_of_birth.day]
    if (isPrimaryApplicant) {
      errorMessage = validate.any(validate.isValidDate('Please enter a valid Date of Birth'), validate.isOldEnough('The primary applicant must be 18 years of age or older'))(DOB)
    } else {
      errorMessage = validate.any(validate.isValidDate('Please enter a valid Date of Birth'))(DOB)
    }
  }
  errors.date_of_birth.all = errorMessage
  errors.date_of_birth.day = errorMessage
  errors.date_of_birth.month = errorMessage
  errors.date_of_birth.year = errorMessage

  return errors
}

validate.isValidDateObject = (date, errors) => {
  let errorMessage

  if (!isEmpty(date)) {
    const dateArray = [date.year, date.month, date.day]
    errorMessage = validate.any(validate.isValidDate('Please enter a valid date.'))(dateArray)
  }

  errors.all = errorMessage
  errors.day = errorMessage
  errors.month = errorMessage
  errors.year = errorMessage

  return errors
}

export default validate
