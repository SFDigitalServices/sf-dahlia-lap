import React from 'react'
import { take, takeRight, map } from 'lodash'
import { generateContent, buildFieldSpecs, buildFieldEntry } from './generateContent'

const splitInHalf = (array) => {
  let halfLength = array.length / 2
  let firstHalf = take(array, Math.floor(halfLength))
  let secondHalf = takeRight(array, Math.ceil(halfLength))

  return { firstHalf, secondHalf }
}

const ListingDetailsContentCard = ({ listing, title, fields }) => {
  const fieldSpecs = map(fields, buildFieldSpecs)
  const entries = map(fieldSpecs, (f) => buildFieldEntry(listing, f))

  let i = 0
  const contents = map(entries, entry => generateContent(listing, entry, i++))

  const { firstHalf, secondHalf } = splitInHalf(contents)

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
