import {
  difference,
  forEach,
  isEmpty,
  isEqual,
  isPlainObject,
  map,
  mapValues,
  propertyOf
} from 'lodash'

// FIXME Rename to a more useful filename.
export const SALESFORCE_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZZ'

export const API_DATE_FORMAT = 'YYYY-MM-DD'

const cleanField = (field) => {
  return field.replace(/__c/g, '').replace(/_/g, ' ')
}

export const pluck =
  (...args) =>
  (obj) => {
    return map(args, propertyOf(obj))
  }

export const decorateComponents = (inputs, fn) => {
  return mapValues(inputs, (Component) => fn(Component))
}

export const formatPercent = (value) => {
  return (value * 100).toFixed(0) + '%'
}

export const isChanged = (prev, current) => {
  return !isEqual(prev, current)
}

export const filterChanged = (prev, current) => {
  if (!prev) {
    return current
  }
  const changedFields = {}
  forEach(current, (value, key) => {
    if (!isEqual(prev[key], value)) {
      // date fields need to be treated as whole
      if (isPlainObject(value) && prev[key] !== null && !isDateObject(value)) {
        const obj = filterChanged(prev[key], value)
        if (!isEmpty(obj)) {
          if (value.id) {
            obj.id = value.id
          }
          changedFields[key] = obj
        }
      } else {
        changedFields[key] = value
      }
    }
  })
  changedFields.id = prev.id
  // Set removed keys to null
  const missingKeys = difference(Object.keys(prev), Object.keys(current))
  forEach(missingKeys, (key) => {
    changedFields[key] = null
  })
  // ada priority fields need to be treated as a whole
  if (changedFields.has_ada_priorities_selected) {
    changedFields.has_ada_priorities_selected = current.has_ada_priorities_selected
  }
  return changedFields
}

export const isDateObject = (object) => {
  if (!object || !isPlainObject(object)) {
    return false
  }
  const objectKeys = Object.keys(object)

  return difference(objectKeys, ['month', 'day', 'year']).length === 0
}

export default {
  cleanField,
  API_DATE_FORMAT
}
