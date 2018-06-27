import React, { Fragment } from 'react'

class ExpandableTable extends React.Component {
  render() {
    const { columns, rows, expanderRenderer, expandedRowRenderer, expandedRowToggler } = this.props

    const numColumns = columns.length

    return (
      <table className="td-light td-plain th-plain" role="grid">
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th key={i} scope="col" className={column.classes ? column.classes.join(' ') : ''}>
                {column.content}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <Fragment>
              <tr key={i} className="tr-expand" aria-expanded="false">
                {row.data.map((datum, j) => (
                  <td key={j}>
                    {datum}
                  </td>
                ))}
                <td key="expander">
                  {expanderRenderer(row, i, expandedRowToggler)}
                </td>
              </tr>
              {
                row.expanded &&
                <tr key="expanded-row" className="tr-expand-content" aria-expanded="true">
                  <td colSpan={numColumns}>
                     {expandedRowRenderer(row, i, expandedRowToggler)}
                  </td>
                </tr>
              }
            </Fragment>
          ))}
        </tbody>
      </table>
    )
  }
}

export default ExpandableTable
