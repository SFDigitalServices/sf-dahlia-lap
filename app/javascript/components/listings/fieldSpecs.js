import { get, includes } from 'lodash'
import moment from 'moment'

import utils from '~/utils/utils'

const getRenderType = (value) => {
  if (includes(value, 'http')) {
    return 'link'
  } else {
    return null
  }
}

const formatValue = (value, type) => {
  if (type === 'date') {
    return moment(value).format('L')
  } else {
    return value
  }
}

export const buildFieldEntry = (item, entry) => {
  let value = get(item, entry.field)
  const label = utils.cleanField(entry.label)
  const renderType = entry.renderType || getRenderType(value)

  value = formatValue(value, entry.formatType)

  return { label, value, renderType }
}
