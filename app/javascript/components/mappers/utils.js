export const mapShape = (mapper, value) => {
  if (value)
    return mapper(value)
  else
    return null
}

export const mapList = (mapper, list) => {
  if (list)
    return list.map(mapper)
  else
    return null
}
