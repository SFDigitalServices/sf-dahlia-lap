import { isObjectLike, isArray, isNaN, toNumber } from 'lodash'
import { isValidPercent, isValidCurrency } from './form/validations'

const toOption = (item) => {
  if (isArray(item)) {
    return { value: item[0], label: item[1] }
  } else if (isObjectLike(item)) {
    return item
  } else {
    return { value: item, label: item }
  }
}

// return an empty input option. Note that the value isn't set to null because that
// will cause the input to fall back to the label on submit.
const toEmptyOption = (label) => toOption(['', label])

const toOptions = (items) => {
  return items.map(toOption)
}

// Formats a number to currency in format eg. $1,000.00
// If the field is empty, return null to prevent salesforce issues.
const formatPrice = (value) => {
  if (!value) return null
  let valueString = value.toString().replace(/[^.|\d]/g, '')

  // return value if value is not valid number
  if (isValidCurrency(value) && !isNaN(parseFloat(valueString))) {
    return '$' + parseFloat(valueString).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
  } else {
    return value
  }
}

// Formats a number to percent in format: 50%, 5.5%, etc
const formatPercent = (value) => {
  if (!value) return null
  if (isValidPercent(value) && !isNaN(parseFloat(value))) {
    // Outer parseFloat removes trailing zeros.
    return parseFloat(parseFloat(value).toFixed(3)) + '%'
  } else {
    return value
  }
}

// filter an object to only include keys that correspond to values that pass the given predicate
const filterValues = (obj, predicate) => Object.fromEntries(
  Object.keys(obj)
    .filter(key => predicate(obj[key]))
    .map(key => [key, obj[key]]))

// remove keys from obj if the values are empty (null or undefined).
// Optionally scrub empty strings ('') as well.
const scrubEmptyValues = (obj, scrubEmptyStrings = false) => {
  const valueIsNonEmpty = (value) =>
    value !== undefined && value !== null && (!scrubEmptyStrings || value !== '')

  return filterValues(obj, valueIsNonEmpty)
}

const formatNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null

  const number = toNumber(value)
  if (isNaN(number)) {
    return value
  } else {
    return number
  }
}

export const maxLengthMap = {
  first_name: 40,
  middle_name: 20,
  last_name: 40,
  email: 40,
  password: 50,
  phone: 40,
  day: 2,
  month: 2,
  year: 4,
  address: 75,
  city: 75,
  state: 2,
  zip: 15,
  alternate_contact_type_other: 200,
  agency_name: 250,
  certificate_number: 50,
  gender_other: 100,
  sexual_orientation_other: 100,
  income: 16
}

export default {
  toEmptyOption,
  formatNumber,
  toOption,
  toOptions,
  formatPrice,
  formatPercent,
  scrubEmptyValues
}
