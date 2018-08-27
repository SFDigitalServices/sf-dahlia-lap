import { omitBy, isUndefined} from 'lodash'

export const mapShape = (mapper, value) => {
  if (value)
    return mapper(value)
  else
    return undefined
}

export const mapList = (mapper, list) => {
  if (list)
    return list.map(mapper)
  else
    return undefined
}

export const compactShape = obj => omitBy(obj, isUndefined)