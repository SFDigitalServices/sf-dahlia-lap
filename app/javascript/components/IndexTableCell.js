import React from 'react'
import _ from 'lodash'

const IndexTableCell = ({ attrs, val, editVal, editing, onChange }) => {
  if (editing && attrs && attrs.editable) {
    if (attrs.editable_options) {
      let options = []
      let i = 0
      _.each(attrs.editable_options, (option) => {
        options.push(
          <option value={option} key={i++}>{option}</option>
        )
      })
      return (
        <select value={editVal} onChange={onChange}>
          {options}
        </select>
      )
    } else {
      return (
        <div>
          <input type='text' value={editVal} onChange={onChange} />
        </div>
      )
    }
  } else {
    // Avoid rendering issues by converting undefined to null.
    return val === undefined ? null : val
  }
}

export default IndexTableCell
