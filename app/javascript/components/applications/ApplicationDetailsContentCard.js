import React from 'react'
import { includes, take, takeRight, map } from 'lodash'
import moment from 'moment'
import utils from '~/utils/utils'

var generateContent = (dataCollection, field, labelMapper, i) => {
  if (dataCollection == null) {
    return
  }
  let value = dataCollection[field]
  let label = utils.cleanField(field)
  if (includes(field, '.')) {
    let parts = field.split('.')
    label = utils.cleanField(parts[0])
    if (dataCollection[label]) {
      value = dataCollection[label][parts[1]]
    }
  }
  if (labelMapper && labelMapper[field]) {
    label = labelMapper[field].label
  }
  if (includes(field, 'Date')) {
    // cheap way of knowing when to parse date fields
    value = moment(value).format('L')
  }
  if (includes(field, 'URL')) {
    // cheap way of knowing when to parse URL fields
    value = <a target='_blank' href={value}>{value}</a>
  }
  if (!value) { value = 'None'}
  return (
    <div className="margin-bottom--half" key={i}>
      <h4 className="t-sans t-small t-bold no-margin">
        {label}
      </h4>
      <p>{value}</p>
    </div>
  )
}

const ApplicationDetailsContentCard = ({ dataCollection, title, fields, labelMapper }) => {
  let firstHalf = Math.ceil(fields.length / 2)
  let lastHalf = fields.length  - firstHalf
  let firstFields = take(fields, firstHalf)
  let lastFields = takeRight(fields, lastHalf)
  let i = 0
  let firstFieldsContent = map(firstFields, field => generateContent(dataCollection, field, labelMapper, i++))
  let lastFieldsContent = map(lastFields, field => generateContent(dataCollection, field, labelMapper, i++))
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

export default ApplicationDetailsContentCard
