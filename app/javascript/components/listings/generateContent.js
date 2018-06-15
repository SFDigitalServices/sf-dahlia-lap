import React from 'react'
import { includes, take, takeRight, map, isString } from 'lodash'
import moment from 'moment'
import utils from '~/utils/utils'

var generateHtml = (value) => {
  return {__html: value}
}

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
  if (type == 'date')
    return moment(value).format('L')
  else
    return value
}

const getLabelValue = (listing, entry) => {
  let value = listing[entry.field]
  let label = utils.cleanField(entry.label)
  let renderType = getRenderType(value)

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

const buildFielEntryWithDefaults = (entry) => {
  let entryWithDefaults = isString(entry) ? { field: entry, label: entry } : entry

  if (!entryWithDefaults.label)
    entryWithDefaults.label = entryWithDefaults.field

  if (!entryWithDefaults.formatType)
    entryWithDefaults.formatType = getFormatType(entryWithDefaults.field)

  return entryWithDefaults
}

const RenderType = ({type, value}) => {
  if (type == 'html') {
    return (<p dangerouslySetInnerHTML={generateHtml(value)} />)
  } else if (type == 'link') {
    return(<a target='_blank' href={value}>{value}</a>)
  } else {
    return (<p>{String(value)}</p>)
  }
}

const Content = ({ label, value, type }) => {
  return (
    <div className="margin-bottom--half">
      <h4 className="t-sans t-small t-bold no-margin">
        {label}
      </h4>
      <RenderType type={type} value={value}/>
    </div>
  )
}

export const generateContent = (listing, field, i) => {
  const entry = buildFielEntryWithDefaults(field)
  const { label, value, renderType } = getLabelValue(listing, entry)
  if (!value)
    return null
  else
    return <Content key={i}
                    label={label}
                    value={value}
                    type={entry.renderType || renderType} />
}
