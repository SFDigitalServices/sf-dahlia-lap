import React from 'react'

import { map, isBoolean } from 'lodash'
import moment from 'moment-timezone'
import arrayUtils from 'utils/arrayUtils'
import { buildFields } from 'utils/fieldSpecs'

const PACIFIC_TIMEZONE = 'America/Los_Angeles'

export const GMTToPacificTime = (gmtTime) => {
  if (!gmtTime) {
    return null
  }
  return moment.utc(gmtTime).tz(PACIFIC_TIMEZONE)
}

const generateContent = (dataCollection, latestDataCollection, entry, i) => {
  if (dataCollection == null) {
    return
  }

  const { label, key } = entry
  let { value } = entry
  if (isBoolean(value)) {
    value = value ? 'Yes' : 'No'
  }
  if (
    latestDataCollection &&
    latestDataCollection[key] !== undefined &&
    latestDataCollection[key] !== value
  ) {
    return (
      <div className='margin-bottom--half' key={i}>
        <div className='application-updated-row'>
          <h4 className='t-sans t-small t-bold no-margin inline'>{label}</h4>
          <span className='application-updated-alert'>updated</span>
        </div>
        <p className='latest-value'>{latest_value}</p>
        <p className='previous-value'>
          <span className='strike-through'>{value}</span>&nbsp;(previous)
        </p>
        <p className='updated-value'>
          Updated {GMTToPacificTime(latestDataCollection[key + '_last_modified']).format('lll')}
        </p>
      </div>
    )
  } else {
    return (
      <div className='margin-bottom--half' key={i}>
        <h4 className='t-sans t-small t-bold no-margin'>{label}</h4>
        <p>{value}</p>
      </div>
    )
  }
}

const ApplicationDetailsContentCard = ({
  dataCollection,
  title,
  fields,
  labelMapper,
  splitOn,
  latestDataCollection
}) => {
  const entries = buildFields(dataCollection, fields, { defaultValue: 'None' })
  const contents = map(entries, (entry, idx) =>
    generateContent(dataCollection, latestDataCollection, entry, idx)
  )
  const { firstHalf, secondHalf } = arrayUtils.split(contents, splitOn)

  return (
    <div className='content-card padding-bottom-none margin-bottom--half bg-trans'>
      <h4 className='content-card_title t-serif'>{title}</h4>
      <ul className='content-grid'>
        <li className='content-item'>
          <div className='content-card'>{firstHalf}</div>
        </li>
        <li className='content-item'>
          <div className='content-card'>{secondHalf}</div>
        </li>
      </ul>
    </div>
  )
}

export default ApplicationDetailsContentCard
