import React from 'react'
import { map } from 'lodash'
import { buildFieldSpecs, buildFieldEntry } from './fieldSpecs'

const getRow = (row, entries) => map(entries, (entry, idx) => (
  <td key={idx}>
    {entry.value}
  </td>
))

const getRows = (items, fieldSpecs) => map(items, (row, idx) => {
  const entries = map(fieldSpecs, (f) => buildFieldEntry(row, f))

  return <tr key={idx}>{getRow(row, entries)}</tr>
})

const getColums = (entries) => map(entries, (entry, idx) => {
  return (
    <th key={idx}>
      {entry.label}
    </th>
  )
})

const ListingDetailsContentTable = ({ listing, title, table, fields }) => {
  const fieldSpecs = map(fields, buildFieldSpecs)

  const columns = getColums(fieldSpecs)
  const rows = getRows(listing[table], fieldSpecs)
  return (
    <div className="content-card">
      <h4 className="content-card_title t-serif">{title}</h4>
      <table>
        <thead>
          <tr>
            {columns}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

export default ListingDetailsContentTable
