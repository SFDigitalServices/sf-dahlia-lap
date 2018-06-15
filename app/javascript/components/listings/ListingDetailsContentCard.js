import React from 'react'
import { includes, take, takeRight, map, isString } from 'lodash'
import moment from 'moment'
import utils from '~/utils/utils'

var generateHtml = (value) => {
  return {__html: value}
}

const formattedValue = (value, field) => {
  if (field === 'Legal_Disclaimers') {
    // TO DO: sanitize html
    return (<p dangerouslySetInnerHTML={generateHtml(value)} />)
  }
  else if (includes(value, 'http')) {
    return(<a target='_blank' href={value}>{value}</a>)
  }
  else {
    return (<p>{String(value)}</p>)
  }
}

const RenderType = (type, value) => {
  if (type == 'html') {
    return (<p dangerouslySetInnerHTML={generateHtml(value)} />)
  } else if (type == 'link') {
    return(<a target='_blank' href={value}>{value}</a>)
  } else {
    return (<p>{String(value)}</p>)
  }
}

const Content = ({ label, value, field  }) => (
  <div className="margin-bottom--half">
    <h4 className="t-sans t-small t-bold no-margin">
      {label}
    </h4>
      {formattedValue(value, field)}
  </div>
)

const getFormatType = (field) => {
  if (includes(field, 'Date'))
    return 'date'
  else
    return null
}

const getFielEntryOrDefaults = (entry) => {
  let entryWithDefaults = isString(entry) ? { field: entry, label: entry } : entry

  if (!entryWithDefaults.type)
    entryWithDefaults.formatType = getFormatType(entryWithDefaults.field)

  return entryWithDefaults
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

  if (includes(entry.field, '.')) {
    let parts = entry.field.split('.')
    label = utils.cleanField(parts[0])
    if (listing[label]) {
      value = listing[label][parts[1]]
    }
  }

  value = getTypedValue(value, entry.formatType)

  return { label, value }
}


var generateContent = (listing, field, i) => {
  const entry = getFielEntryOrDefaults(field)
  const { label, value } = getLabelValue(listing, entry)

  if (!value)
    return
  else
    return <Content key={i} label={label} value={value} field={field} />
}

const ListingDetailsContentCard = ({ listing, title, fields }) => {
  // console.log(title)
  // console.log(fields)
  let halfLength = fields.length / 2
  let firstFields = take(fields, Math.floor(halfLength))
  let lastFields = takeRight(fields, Math.ceil(halfLength))

  let i = 0
  let firstFieldsContent = map(firstFields, field => generateContent(listing, field, i++))
  let lastFieldsContent = map(lastFields, field => generateContent(listing, field, i++))

  return (
      <div className="content-card padding-bottom-none margin-bottom--half bg-trans">
        <h4 className="content-card_title t-serif">{title}</h4>

        <ul className="content-grid">
          <li className="content-item">
            <div className="content-card">
              {firstFieldsContent}
            </div>
          </li>
          <li className="content-item">
            <div className="content-card">
              {lastFieldsContent}
            </div>
          </li>
        </ul>
      </div>
  )
}

export default ListingDetailsContentCard
