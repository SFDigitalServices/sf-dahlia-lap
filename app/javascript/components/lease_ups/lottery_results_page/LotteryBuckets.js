import React, { useState } from 'react'

import EasyEdit from 'react-easy-edit'

import { Preferences } from './utils/preferences'

const ColumnMaxWidth = 20 // in ch units

const LotteryBucketTitle = ({ id, shortName }) => {
  return (
    <th id='lottery-results-pdf-th' key={id}>
      <h4 id='lottery-results-pdf-th-h4'>{shortName}</h4>
    </th>
  )
}

const LotteryBucketSubtitle = ({ id, subtitle }) => {
  const [editableSubtitle, setEditableSubtitle] = useState(subtitle)
  return (
    <td id='lottery-results-pdf-column' key={id}>
      <h5>
        <EasyEdit type='text' value={editableSubtitle} onSave={setEditableSubtitle} />
      </h5>
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
  const titleCells = []
  const subtitleCells = []
  const resultCells = []

  buckets.forEach((bucket) => {
    const preference = Preferences[bucket.shortCode]

    // an unmapped short code used to throw here and blank the entire page, so
    // skip just the offending column instead
    if (!preference) {
      console.warn(`Unknown preference: ${bucket.shortCode}`)

      return
    }

    const { id, subtitle, shortName } = preference

    titleCells.push(<LotteryBucketTitle key={id} shortName={shortName} />)

    subtitleCells.push(<LotteryBucketSubtitle key={id} subtitle={subtitle} />)

    resultCells.push(<LotteryBucketResult key={id} preferenceResults={bucket.preferenceResults} />)
  })

  // to allow the table to expand, up to a point, when there's more room, we
  // have to put it inside a section that has a max-width set on it, based on
  // the number of columns actually rendered.  we can't calculate that in CSS,
  // unfortunately.
  const maxWidth = `${titleCells.length * ColumnMaxWidth}ch`
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
