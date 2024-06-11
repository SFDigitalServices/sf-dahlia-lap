import React from 'react'

import { Preferences } from './utils/constants'

const ColumnMaxWidth = 20 // in ch units

const LotteryBucketTitle = ({ id, shortName }) => {
  return (
    <th id='lottery-results-pdf-th' key={id}>
      <h4 id='lottery-results-pdf-th-h4'>{shortName}</h4>
    </th>
  )
}

const LotteryBucketSubtitle = ({ id, subtitle }) => {
  return (
    <td id='lottery-results-pdf-column' key={id}>
      <h5>{subtitle}</h5>
    </td>
  )
}
const LotteryBucketResult = ({ id, preferenceResults }) => {
  const items = preferenceResults.map((application) => {
    return (
      <li key={application.lottery_number}>
        {application.lottery_number}
        {application.isVeteran ? '*' : ''}
      </li>
    )
  })

  return (
    <td id='lottery-results-pdf-column' key={id}>
      <ol>{items}</ol>
    </td>
  )
}

export const LotteryBuckets = ({ buckets = [] }) => {
  const maxWidth = `${buckets.length * ColumnMaxWidth}ch`
  const titleCells = []
  const subtitleCells = []
  const resultCells = []

  buckets.forEach((bucket) => {
    const { id, subtitle, shortName } = Preferences[bucket.shortCode]

    titleCells.push(<LotteryBucketTitle key={id} shortName={shortName} />)

    subtitleCells.push(<LotteryBucketSubtitle key={id} subtitle={subtitle} />)

    resultCells.push(<LotteryBucketResult key={id} preferenceResults={bucket.preferenceResults} />)
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

export default LotteryBuckets
