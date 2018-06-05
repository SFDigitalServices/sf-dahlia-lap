import { forEach, isFunction } from 'lodash'

export const mapFields = (fieldMapper, to, from ) => {
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
