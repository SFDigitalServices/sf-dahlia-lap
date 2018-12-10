import { map, propertyOf, mapValues } from 'lodash'

// FIXME Rename to a more useful filename.
const SALESFORCE_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZZ'

const API_DATE_FORMAT = 'YYYY-MM-DD'
const cleanField = (field) => {
  return field.replace(/__c/g, '').replace(/_/g, ' ')
}

export const pluck = (...args) => (obj) => {
  return map(args, propertyOf(obj))
}

export const decorateComponents = (inputs, fn) => {
  return mapValues(inputs, Component => fn(Component))
}

export const formatPercent = (value) => {
  return ((value * 100).toFixed(0) + '%')
}

export default {
  cleanField,
  SALESFORCE_DATE_FORMAT,
  API_DATE_FORMAT
}
