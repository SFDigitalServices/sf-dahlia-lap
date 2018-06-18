import React from 'react'
import { map } from 'lodash'
import { buildFieldSpecs, buildFieldEntry } from './fieldSpecs'
import Field from './Field'
import arrayUtils from '~/utils/arrayUtils'

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

const ListingDetailsContentCard = ({ listing, title, fields }) => {
  const fieldSpecs = map(fields, buildFieldSpecs)
  const entries = map(fieldSpecs, (f) => buildFieldEntry(listing, f))
  // console.log(title)
  // console.log(entries)
  const contents = map(entries, (entry, idx) => generateContent(listing, entry, idx))
  const { firstHalf, secondHalf } = arrayUtils.splitInHalf(contents)

  return (
      <div className="content-card padding-bottom-none margin-bottom--half bg-trans">
        <h4 className="content-card_title t-serif">{title}</h4>

        <ul className="content-grid">
          <li className="content-item">
            <div className="content-card">
              {firstHalf}
            </div>
          </li>
          <li className="content-item">
            <div className="content-card">
              {secondHalf}
            </div>
          </li>
        </ul>
      </div>
  )
}

export default ListingDetailsContentCard
