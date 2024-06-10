import React from 'react'

import { by } from '../utils/byFunction'
import { Preferences } from '../utils/constants'

const ColumnMaxWidth = 20 // in ch units

const Column = ({ bucket }) => {
  const items = bucket.map((application) => {
    let lotteryNumber = ''
    if (application.application) {
      lotteryNumber =
        application.application?.lottery_number_manual ?? application.application.lottery_number
    } else {
      lotteryNumber = application.lottery_number ?? application.lottery_number_manual
    }

    return (
      <li key={lotteryNumber}>
        {lotteryNumber}
        {application.isVeteran ? '*' : ''}
      </li>
    )
  })

  return <ol>{items}</ol>
}

export default function LotteryBuckets({ buckets = [] }) {
  const unfilteredPreferenceResults = Object.values(buckets).reduce((acc, bucket) => {
    for (const result of bucket) acc.push(result)
    return acc
  }, [])

  const unfilteredBucket = {
    preferenceName: 'Unfiltered Rank',
    preferenceResults: unfilteredPreferenceResults.sort(by('preference_all_lottery_rank'))
  }

  // put the bucket of unfiltered applicants first
  const combinedBuckets = [unfilteredBucket, ...Object.values(buckets)]
  const maxWidth = `${combinedBuckets.length * ColumnMaxWidth}ch`
  const titleCells = []
  const subtitleCells = []
  const resultCells = []

  combinedBuckets.forEach((bucket) => {
    let shortCode = ''
    if (bucket.preferenceName) {
      shortCode = bucket.preferenceName
    } else {
      shortCode = bucket[0]?.custom_preference_type ?? 'General List'
    }

    if (bucket.preferenceResults) {
      bucket = bucket.preferenceResults
    }

    const { subtitle, shortName } = Preferences[shortCode]

    titleCells.push(
      <th id='lottery-results-pdf-th' key={shortCode}>
        <h4 id='lottery-results-pdf-th-h4'>{shortName}</h4>
      </th>
    )

    subtitleCells.push(
      <td id='lottery-results-pdf-column' key={shortCode}>
        <h5>{subtitle}</h5>
      </td>
    )

    resultCells.push(
      <td id='lottery-results-pdf-column' key={shortCode}>
        <Column bucket={bucket} />
      </td>
    )
  })

  // to allow the table to expand, up to a point, when there's more room, we
  // have to put it inside a section that has a max-width set on it, based on
  // the number of columns.  we can't calculate that in CSS, unfortunately.
  return (
    <div style={{ maxWidth }} id='lottery-results-section'>
      <table id='lottery-results-table'>
        <thead>
          <tr id='lottery-results-pdf-row'>{titleCells}</tr>
        </thead>
        <tbody>
          <tr id='lottery-results-pdf-row'>{subtitleCells}</tr>
          <tr id='lottery-results-pdf-row'>{resultCells}</tr>
        </tbody>
      </table>
    </div>
  )
}
