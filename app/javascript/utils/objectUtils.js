import {
  forEach,
  includes,
  isFunction,
  isEmpty,
  isUndefined,
  isNil,
  keys,
  map,
  omitBy,
  snakeCase
} from 'lodash'

export const checkSnakeCase = (obj) => {
  forEach(obj, (value, key) => {
    if (key !== 'naturalKey' && key !== snakeCase(key)) {
      console.warn(`fieldMapper: ${key} is not snake case`)
    }
  })
}

export const mapFields = (fieldMapper, to, from) => {
  if (isUndefined(from)) {
    return undefined
  }
  if (isNil(from)) {
    return null
  }
  if (isEmpty(keys(from))) {
    return undefined
  }

  checkSnakeCase(from)

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

export const listMapper = (field, fieldsMapper) => (source) => {
  return map(source[field], (i) => mapFields(fieldsMapper, {}, i))
}

export const omitEmpty = (source, fields) =>
  omitBy(source, (value, key) => includes(fields, key) && isEmpty(value))

export const snakeToCamelCase = (str) => {
  return str.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '')
  })
}

export const convertObjectKeysSnakeCaseToCamelCase = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(convertObjectKeysSnakeCaseToCamelCase)
  }

  const newObj = {}
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const camelKey = snakeToCamelCase(key)
      newObj[camelKey] = convertObjectKeysSnakeCaseToCamelCase(obj[key])
    }
  }
  return newObj
}
