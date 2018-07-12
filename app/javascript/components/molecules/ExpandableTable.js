import React from 'react'
import ExpandableTableRow from './ExpandableTableRow'

class ExpandableTable extends React.Component {
  render() {
    const { columns, rows, expanderRenderer, expandedRowRenderer } = this.props

    // const numColumns = columns.length

    return (
      <table className="td-light td-plain th-plain" role="grid">
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th key={i} scope="col" className={column.classes ? column.classes.join(' ') : ''}>
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <ExpandableTableRow
              key={i}
              row={row}
              columns={columns}
              expanderRenderer={expanderRenderer}
              expandedRowRenderer={expandedRowRenderer} />
          ))}
        </tbody>
      </table>
    )
  }
}

ExpandableTable.ExpanderButton = ({ onClick }) => {
  return (
    <button
      type='button'
      className="button button-link action-link"
      onClick={onClick}>
      Expand
    </button>
  )
}

export default ExpandableTable
