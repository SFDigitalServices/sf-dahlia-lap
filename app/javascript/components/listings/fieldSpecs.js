import { get, toLower, includes, isString, camelCase, startCase } from 'lodash'
import moment from 'moment'

import utils from '~/utils/utils'

const getFormatType = (field) => {
  if (includes(toLower(field), 'date'))
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

const formatValue = (value, type) => {
  if (type === 'date')
    return moment(value).format('L')
  else
    return value
}

const formatLabel = (label) => {
  if (includes(label, '.')) {
    const parts = label.split('.')
    return startCase(camelCase(utils.cleanField(parts[0])))
  } else {
   return startCase(camelCase(label))
 }
}

export const buildFieldEntry = (listing, entry) => {
  let value = get(listing, entry.field)
  let label = utils.cleanField(entry.label)
  let renderType = entry.renderType || getRenderType(value)

  // if (includes(entry.field, '.')) {
  //   let parts = entry.field.split('.')
  //   label = utils.cleanField(parts[0])
  //   if (listing[label]) {
  //     value = listing[label][parts[1]]
  //   }
  // }

  value = formatValue(value, entry.formatType)

  return { label, value, renderType }
}

export const buildFieldSpecs = (entry) => {
  let specs = isString(entry) ? { field: entry } : entry

  specs.field = toLower(specs.field)
  if (!specs.label) {
    specs.label = formatLabel(specs.field)
  }

  if (!specs.formatType)
    specs.formatType = getFormatType(specs.field)

  return specs
}
