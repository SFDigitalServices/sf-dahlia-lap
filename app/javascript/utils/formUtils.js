import { isObjectLike } from 'lodash'

const toOption = (item) =>  {
  if (isObjectLike(item))
    return item
  else
    return { value: item, label: item}
}
const toOptions = (items) => {
  return items.map(toOption)
}

export default {
  toOption,
  toOptions
}
