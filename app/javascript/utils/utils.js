import { forEach, isEmpty, isEqual, isPlainObject, map, mapValues, propertyOf } from 'lodash'

// FIXME Rename to a more useful filename.
export const SALESFORCE_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZZ'

export const API_DATE_FORMAT = 'YYYY-MM-DD'

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

export const filterChanged = (prev, current) => {
  if (!prev) {
    return current
  }
  const changedFields = {}
  forEach(current, (value, key) => {
    if (!isEqual(prev[key], value)) {
      if (isPlainObject(value) && prev[key] !== null) {
        const obj = filterChanged(prev[key], value)
        if (!isEmpty(obj)) {
          obj['id'] = value.id
          changedFields[key] = obj
        }
      } else {
        changedFields[key] = value
      }
    }
  })
  changedFields['id'] = prev['id']
  return changedFields
}

export default {
  cleanField,
  API_DATE_FORMAT
}
