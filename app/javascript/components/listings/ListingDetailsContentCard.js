import React from 'react'
import { includes, take, takeRight, map, isString } from 'lodash'
import { generateContent } from './generateContent'

const ListingDetailsContentCard = ({ listing, title, fields }) => {
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
