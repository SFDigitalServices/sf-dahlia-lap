import {
  forEach,
  isFunction,
  omitBy,
  includes,
  isEmpty,
  isUndefined,
  isNil,
  keys
} from 'lodash'

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

export const createFieldMapper = (fields) => (source) => mapFields(fields, {}, source)

export const shapeMapper = (field, fieldsMapper) => (source) => {
  return mapFields(fieldsMapper, {}, source[field])
}

export const listMapper = (field, fieldsMapper) =>  (source) => {
  return source[field].map(i => mapFields(fieldsMapper, {}, i))
}

export const omitEmpty = (source, fields) => (
  omitBy(source, (value, key) => includes(fields, key) && isEmpty(value))
)
