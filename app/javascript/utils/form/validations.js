import { unflatten, flatten } from 'flat'
import { compact, first, isEmpty, isNil, isString, mapValues, map, toInteger } from 'lodash'
import moment from 'moment'

import { API_DATE_FORMAT } from 'utils/utils'

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
  return (values) => {
    return run(rules, values, ifRules)
  }
}

/* Validations */

const validates = (fun, message) => (value) => {
  return fun(value) ? undefined : message
}

const decorateValidator = (fn) => (message) => validates(fn, message)

const isOldEnough = (dateOfBirth) => {
  if (dateOfBirth && isDate(dateOfBirth)) {
    const years = moment().diff(moment(dateOfBirth.join('-'), API_DATE_FORMAT), 'years')
    return years >= 18
  } else {
    return false
  }
}

const isDate = (date) => {
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
  const emailRegex = new RegExp(
    [
      "^[a-zA-Z0-9!%&'*+\\/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!%&'*+\\/=?^_`{|}~-]+)*",
      '@',
      '(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$'
    ].join('')
  )
  if (email) {
    return emailRegex.test(email)
  }
  return true
}

const isEmptyString = (value) => isNil(value) || value.length === 0

export const isValidCurrency = (value) => {
  if (isEmptyString(value)) {
    return true
  } else {
    // Example passing values: 5, $5, 5.01, $5.01
    return /^\$?[0-9]+[0-9,]*\.?[0-9]*$/.test(value)
  }
}

export const isValidPercent = (value) => {
  if (isEmptyString(value)) {
    return true
  } else {
    // Example passing values: 5, 10.2, 50.50%, 524%
    return /^[0-9]+\.?[0-9]*%?$/.test(value)
  }
}

const isUnderMaxValue = (maxValue) => (value) => {
  if (isNil(value) || value === '') {
    return true
  }
  const incomeFloat = isString(value) ? parseFloat(value.replace(/[$,]+/g, '')) : value
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

const isValidUrl = (value) => {
  try {
    // eslint-disable-next-line no-new
    new URL(value)
    return true
  } catch (err) {
    return false
  }
}

validate.isValidEmail = decorateValidator(isValidEmail)
validate.isOldEnough = decorateValidator(isOldEnough)
validate.isDate = decorateValidator(isDate)
validate.isValidCurrency = decorateValidator(isValidCurrency)
validate.isValidPercent = decorateValidator(isValidPercent)
validate.isUnderMaxValue = (maxVal) => decorateValidator(isUnderMaxValue(maxVal))
validate.isPresent = decorateValidator(isPresent)
validate.isChecked = decorateValidator(isChecked)
validate.isValidUrl = decorateValidator(isValidUrl)
validate.list = (fn) => (list) => map(list, fn)
validate.any =
  (...fns) =>
  (value) => {
    return first(compact(map(fns, (fn) => fn(value))))
  }

// Options accept:
// - isPrimaryApplicant: validates also minimum age of 18 years
// - errorMessage: changes default error message
validate.isValidDate = (date, errors, options = {}) => {
  let errorMessage = options.errorMessage || 'Please enter a valid date.'
  if (date) {
    let dateArray = [date.year, date.month, date.day]
    if (options.isPrimaryApplicant) {
      dateArray = map(dateArray, (value) => {
        return toInteger(value)
      })
      errorMessage = validate.any(
        validate.isDate(errorMessage),
        validate.isOldEnough('The primary applicant must be 18 years of age or older')
      )(dateArray)
    } else {
      errorMessage = validate.any(validate.isDate(errorMessage))(dateArray)
    }
  }
  errors.all = errorMessage
  // Required for red highlighting around inputs
  errors.day = errorMessage
  errors.month = errorMessage
  errors.year = errorMessage

  return errors
}

export const touchAllFields = (form, touchedState) => {
  Object.keys(touchedState).map((fieldName) => form.blur(fieldName))
}

export const validateLeaseCurrency = (value) => {
  return (
    validate.isValidCurrency('Please enter a valid dollar amount.')(value) ||
    validate.isUnderMaxValue(Math.pow(10, 5))('Please enter a smaller number.')(value)
  )
}

const convertValues = (values, convertValueFunc) => {
  const flattenedValues = flatten(values)
  Object.keys(flattenedValues).forEach((key) => {
    flattenedValues[key] = convertValueFunc(flattenedValues[key])
  })

  return unflatten(flattenedValues)
}

const isCurrencyString = (value) =>
  typeof value === 'string' && value.startsWith('$') && isValidCurrency(value)

/**
 * Convert Currency
 *
 * Takes in form values object, flattens all fields down to
 * the top level so that we can iterate through and parse the
 * currency fields then unflattens back to the correct object
 */
export const convertCurrency = (values) => {
  const convertToFloat = (value) => parseFloat(parseFloat(value.replace(/\$|,/g, '')).toFixed(2))
  return convertValues(values, (value) => {
    return isCurrencyString(value) ? convertToFloat(value) : value
  })
}

/**
 * Convert Currency and Percent strings to numbers
 *
 * Takes in form values object, flattens all fields down to
 * the top level so that we can iterate through and parse the
 * currency fields into floats and the percent fields into integers
 * then unflattens back to the correct object
 */
export const convertPercentAndCurrency = (values) => {
  const convertPercentToFloat = (value) => parseFloat(value)
  const convertCurrencyToFloat = (value) =>
    parseFloat(parseFloat(value.replace(/\$|,/g, '')).toFixed(2))
  return convertValues(values, (value) => {
    if (typeof value !== 'string') return value

    if (value.endsWith('%') && isValidPercent(value)) {
      return convertPercentToFloat(value)
    } else if (isCurrencyString(value)) {
      return convertCurrencyToFloat(value)
    }

    return value
  })
}

export default validate
