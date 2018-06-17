import React from 'react'
import { includes, isString } from 'lodash'
import moment from 'moment'

import utils from '~/utils/utils'
import Field from './Field'

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
  let entryWithDefaults = isString(entry) ? { field: entry, label: entry } : entry

  if (!entryWithDefaults.label)
    entryWithDefaults.label = entryWithDefaults.field

  if (!entryWithDefaults.formatType)
    entryWithDefaults.formatType = getFormatType(entryWithDefaults.field)

  return entryWithDefaults
}

export const generateContent = (listing, entry, i) => {
  const { label, value, renderType } = entry
  if (!value)
    return null
  else
    return <Field key={i}
                    label={label}
                    value={value}
                    type={renderType} />
}
