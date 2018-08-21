import { map, propertyOf, mapValues } from 'lodash'

const SALESFORCE_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZZ"

const cleanField = (field) => {
  return field.replace(/__c/g, '').replace(/_/g, ' ')
}

export const pluck = (...args) => (obj) => {
  return map(args, propertyOf(obj) )
}

export const decorateComponents = (inputs, fn) => {
  return mapValues(inputs, Component => fn(Component))
}


export default {
  cleanField,
  SALESFORCE_DATE_FORMAT,
}
