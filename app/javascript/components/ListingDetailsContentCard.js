import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import utils from '../utils'

var generateContent = (listing, field, i) => {
  const formattedValue = (value, field) => {
    if (_.includes(value, 'http')) {
      return(<a target='_blank' href={value}>{value}</a>)
    }
    else {
      return (<p>{String(value)}</p>)
    }
  }

  let value = listing[field]
  let label = utils.cleanField(field)

  if (_.includes(field, '.')) {
    let parts = field.split('.')
    label = utils.cleanField(parts[0])
    if (listing[label]) {
      value = listing[label][parts[1]]
    }
  }
  if (_.includes(field, 'Date')) {
    // cheap way of knowing when to parse date fields
    value = moment(value).format('L')
  }

  if (!value) return
  return (
    <div className="margin-bottom--half" key={i}>
      <h4 className="t-sans t-small t-bold no-margin">
        {label}
      </h4>
        {formattedValue(value, field)}
    </div>
  )
}

const ListingDetailsContentCard = ({ listing, title, fields }) => {
  let halfLength = fields.length / 2
  let firstFields = _.take(fields, Math.floor(halfLength))
  let lastFields = _.takeRight(fields, Math.ceil(halfLength))

  let i = 0
  let firstFieldsContent = _.map(firstFields, field => generateContent(listing, field, i++))
  let lastFieldsContent = _.map(lastFields, field => generateContent(listing, field, i++))

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
