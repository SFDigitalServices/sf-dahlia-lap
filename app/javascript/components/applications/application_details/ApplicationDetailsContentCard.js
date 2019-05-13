import React from 'react'
import { map, isBoolean } from 'lodash'
import { buildFields } from '~/utils/fieldSpecs'
import arrayUtils from '~/utils/arrayUtils'

var generateContent = (dataCollection, entry, i) => {
  if (dataCollection == null) { return }

  const { label } = entry
  let { value } = entry
  if (isBoolean(value)) {
    value = value ? 'Yes' : 'No'
  }
  return (
    <div className='margin-bottom--half' key={i}>
      <h4 className='t-sans t-small t-bold no-margin'>
        {label}
      </h4>
      <p>{value}</p>
    </div>
  )
}

const ApplicationDetailsContentCard = ({ dataCollection, title, fields, labelMapper, splitOn }) => {
  const entries = buildFields(dataCollection, fields, { defaultValue: 'None' })
  const contents = map(entries, (entry, idx) => generateContent(dataCollection, entry, idx))
  const { firstHalf, secondHalf } = arrayUtils.split(contents, splitOn)
  return (
    <div className='content-card padding-bottom-none margin-bottom--half bg-trans'>
      <h4 className='content-card_title t-serif'>{title}</h4>
      <ul className='content-grid'>
        <li className='content-item'>
          <div className='content-card'>
            {firstHalf}
          </div>
        </li>
        <li className='content-item'>
          <div className='content-card'>
            {secondHalf}
          </div>
        </li>
      </ul>
    </div>
  )
}

export default ApplicationDetailsContentCard
