import React from 'react'
import { map } from 'lodash'
import { buildFields } from '~/utils/fieldSpecs'
import arrayUtils from '~/utils/arrayUtils'

var generateContent = (dataCollection, entry, i) => {
  if (dataCollection == null) { return }

  const { value, label } = entry

  return (
    <div className='margin-bottom--half' key={i}>
      <h4 className='t-sans t-small t-bold no-margin'>
        {label}
      </h4>
      <p>{value}</p>
    </div>
  )
}

const ApplicationDetailsContentCard = ({ dataCollection, title, fields, labelMapper }) => {
  const entries = buildFields(dataCollection, fields, { defaultValue: 'None' })
  const contents = map(entries, (entry, idx) => generateContent(dataCollection, entry, idx))
  const { firstHalf, secondHalf } = arrayUtils.splitInHalf(contents)
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
