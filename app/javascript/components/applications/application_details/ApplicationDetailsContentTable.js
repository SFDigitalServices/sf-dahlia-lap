import React from 'react'
import { map, isPlainObject, get } from 'lodash'
import appPaths from '~/utils/appPaths'
import { getLabel } from './utils'
import { renderNative } from '~/utils/renderUtils'

const getColumns = (fields) => map(fields, (field) => {
  const label = getLabel(field)

  return <th key={label}>{label}</th>
})

const getRow = (row, field) => {
  if (isPlainObject(field)) {
    field = field.field
  }
  if (field === 'view record set') {
    return (
      <td key='view'>
        <a href={appPaths.toApplicationsFlagged(row.flagged_record.id)}>
          View Record Set
        </a>
      </td>
    )
  }
  const value = get(row, field)
  return <td key={field}>{renderNative(value)}</td>
}

const getRows = (data, fields) => map(data, (row, idx) => {
  const tableData = map(fields, field => getRow(row, field))
  return (
    <tr key={idx}>
      {tableData}
    </tr>
  )
})

const ApplicationDetailsContentTable = ({ data, title, table, fields }) => {
  const columns = getColumns(fields)
  const rows = getRows(data[table], fields)

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

export default ApplicationDetailsContentTable
