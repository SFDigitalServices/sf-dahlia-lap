import React from 'react'
import { map, includes, last } from 'lodash'
import utils from '~/utils/utils'

const ListingDetailsContentTable = ({ listing, title, table, fields }) => {
  let i = 0
  let columns = map(fields, (field) => {
    if (includes(field, '.')) {
      field = last(field.split('.'))
    }
    return <th key={field}>{utils.cleanField(field)}</th>
  })
  let rows = map(listing[table], (row) => {
    let tableData = map(fields, (field) => {
      let value = row[field]
      if (includes(field, '.')) {
        let parts = field.split('.')
        // e.g. Lottery_Preference.Name, grab from nested object
        value = row[parts[0]][parts[1]]
      }
      return <td key={field}>{value}</td>
    })
    return (
      <tr key={i++}>
        {tableData}
      </tr>
    )
  })

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
