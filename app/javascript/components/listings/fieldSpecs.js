import { includes, isString } from 'lodash'
import moment from 'moment'

import utils from '~/utils/utils'

const getFormatType = (field) => {
  if (includes(field, 'Date'))
    return 'date'
  else
    return null
}

const getRenderType = (value) => {
  if (includes(value, 'http')) {
    return 'link'
  } else {
    return null
  }
}

const getTypedValue = (value, type) => {
  if (type === 'date')
    return moment(value).format('L')
  else
    return value
}

export const buildFieldEntry = (listing, entry) => {
  let value = listing[entry.field]
  let label = utils.cleanField(entry.label)
  let renderType = entry.renderType || getRenderType(value)

  if (includes(entry.field, '.')) {
    let parts = entry.field.split('.')
    label = utils.cleanField(parts[0])
    if (listing[label]) {
      value = listing[label][parts[1]]
    }
  }

  value = getTypedValue(value, entry.formatType)

  return { label, value, renderType }
}

export const buildFieldSpecs = (entry) => {
  let specs = isString(entry) ? { field: entry, label: entry } : entry

  if (!specs.label)
    specs.label = specs.field

  if (!specs.formatType)
    specs.formatType = getFormatType(specs.field)

  return specs
}
