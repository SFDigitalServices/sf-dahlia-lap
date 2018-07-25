import {
  forEach, isFunction, omitBy,
  isEmpty, map, isUndefined, isObjectLike, includes,
  isNil, keys
} from 'lodash'

const isNotPresent = (value, key) => {
  if (isObjectLike(value))
    return isEmpty(value)
  else
    return isUndefined(value)
}

export const mapFields = (fieldMapper, to, from ) => {
  if (isUndefined(from))
    return undefined
  if (isNil(from))
    return null
  if (isEmpty(keys(from)))
    return undefined

  forEach(fieldMapper, (toField, fromField) => {
    if (isFunction(toField)) {
      to[fromField] = toField(from)
    } else {
      to[toField] = from[fromField]
    }
  })
  return to
}

export const createFieldMapper = (fields) => (source) => (
  mapFields(fields, {}, source)
)

export const shapeMapper = (field, fieldsMapper) => (source) => {
  return mapFields(fieldsMapper, {}, source[field])
}

export const listMapper = (field, fieldsMapper) => (source) => {
  return map(source[field], i => mapFields(fieldsMapper, {}, i))
}

export const omitEmpty = (source, fields) => (
  omitBy(source, (value, key) => includes(fields, key) && isEmpty(value))
)
