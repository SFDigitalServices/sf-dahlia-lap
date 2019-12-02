import { isObjectLike, isArray, isEmpty } from 'lodash'

const toOption = (item) => {
  if (isArray(item)) {
    return { value: item[0], label: item[1] }
  } else if (isObjectLike(item)) {
    return item
  } else {
    return { value: item, label: item }
  }
}

const toOptions = (items) => {
  return items.map(toOption)
}

// Formats a numer to currency in format eg. $1,000.00
const formatPrice = (value) => {
  if (!value) return ''
  let valueString = value.toString().replace(/[^.|\d]/g, '')

  // return value if value is not valid number
  if (parseFloat(valueString)) {
    return '$' + parseFloat(valueString).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
  } else {
    return value
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

export const reorderEmptyOptions = (options) => {
  options.some((option, i) => isEmpty(option.value) && options.unshift(option) && options.splice(i + 1, 1))
  return options
}

export default {
  toOption,
  toOptions,
  formatPrice
}
