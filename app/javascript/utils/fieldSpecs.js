import { each, replace, get, toLower, includes, isString, camelCase, startCase, map } from 'lodash'
import moment from 'moment'

import formUtils from 'utils/formUtils'
import utils from 'utils/utils'

const PHONE_FIELDS = new Set(['phone', 'second_phone'])

export const getFormatType = (field) => {
  const lowerField = toLower(field)
  if (includes(lowerField, 'date')) {
    return 'date'
  }
  if (PHONE_FIELDS.has(lowerField)) {
    return 'phone'
  }
  return null
}

const getRenderType = (value) => {
  if (includes(value, 'http')) {
    return 'link'
  } else {
    return null
  }
}

const dateIsJson = (date) => {
  return date && typeof date === 'object' && 'month' in date && 'day' in date && 'year' in date
}

export const formatValue = (value, type) => {
  if (type === 'date') {
    // Convert domain date object to string if needed
    if (dateIsJson(value)) {
      return moment(`${value.year}-${value.month}-${value.day}`, utils.API_DATE_FORMAT).format('L')
    }
    return moment(value).format('L')
  } else if (type === 'currency') {
    return formUtils.formatPrice(value)
  } else if (type === 'phone') {
    return formUtils.formatPhone(value)
  } else {
    return value
  }
}

const cleanupWords = (value) => {
  each(
    [
      [' Or ', ' or '],
      [' Of ', ' of '],
      ['Proof', 'proof'],
      ['Who', 'who'],
      ['Ada', 'ADA'],
      [' To ', ' to '],
      ['Claimed', 'claimed']
    ],
    ([a, b]) => {
      value = replace(value, a, b)
    }
  )

  return value
}

const formatLabel = (label) => {
  if (includes(label, '.')) {
    const parts = label.split('.')
    return startCase(camelCase(utils.cleanField(parts[0])))
  } else {
    return cleanupWords(startCase(camelCase(label)))
  }
}

export const buildFieldEntry = (item, spec, options = {}) => {
  const key = spec.field
  let value = get(item, key)

  if (spec.value) {
    value = spec.value(value)
  }

  const label = utils.cleanField(spec.label)
  const renderType = spec.renderType || getRenderType(value)

  value = formatValue(value, spec.formatType)

  if (!value && options.defaultValue) {
    value = options.defaultValue
  }

  return { label, value, renderType, key }
}

export const buildFieldSpecs = (entry) => {
  const specs = isString(entry) ? { field: entry } : entry

  if (!specs.label) {
    specs.label = formatLabel(specs.field)
  }

  if (!specs.formatType) {
    specs.formatType = getFormatType(specs.field)
  }

  return specs
}

export const buildFields = (data, fields, options = {}) => {
  const fieldSpecs = map(fields, (f) => buildFieldSpecs(f))
  return map(fieldSpecs, (f) => buildFieldEntry(data, f, options))
}
