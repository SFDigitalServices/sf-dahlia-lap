import React from 'react'

import { by } from '../utils/byFunction'
import { Preferences } from '../utils/constants'

const ColumnMaxWidth = 20 // in ch units

function Column({ bucket }) {
  const items = bucket.preferenceResults.map(({ lotteryNumber, hasVeteranPref }) => (
    <li key={lotteryNumber}>
      {lotteryNumber}
      {hasVeteranPref ? '*' : ''}
    </li>
  ))

  return <ol>{items}</ol>
}

export default function LotteryBuckets({ buckets = [] }) {
  const applicants = new Map()

  // combine all the buckets into one list with every applicant appearing once
  buckets
    ?.map(({ preferenceResults }) => preferenceResults)
    .flat()
    .forEach((applicant) => {
      applicants.set(applicant.lotteryNumber, applicant)
    })

  // create a bucket with a rank-ordered list of applicants
  const unfilteredBucket = {
    preferenceName: 'Unfiltered',
    preferenceResults: [...applicants.values()].sort(by('lotteryRank'))
  }
  // put the bucket of unfiltered applicants first
  const combinedBuckets = [unfilteredBucket, ...buckets]
  const maxWidth = `${combinedBuckets.length * ColumnMaxWidth}ch`
  const titleCells = []
  const subtitleCells = []
  const resultCells = []

  combinedBuckets.forEach((bucket) => {
    const { id, shortName, subtitle } = Preferences[bucket.preferenceName]

    titleCells.push(
      <th id='lottery-results-pdf-th' key={id}>
        <h4 id='lottery-results-pdf-th-h4'>{shortName}</h4>
      </th>
    )

    subtitleCells.push(
      <td id='lottery-results-pdf-column' key={id}>
        <h5>{subtitle}</h5>
      </td>
    )

    resultCells.push(
      <td id='lottery-results-pdf-column' key={id}>
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
