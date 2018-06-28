import React, { Fragment } from 'react'

class ExpandableTableRow extends React.Component {
  constructor (props) {
    super(props)
    this.state = {row: this.props.row}
  }

  toggleExpandedRow = () => {
    this.setState((prevState) => {
      return {
        row: {
          ...prevState.row,
          expanded: !prevState.row.expanded
        }
      }
    })
  }

  render() {
    const { numColumns, expanderRenderer, expandedRowRenderer } = this.props
    const { row } = this.state

    return (
      <Fragment>
        <tr className="tr-expand" aria-expanded="false">
          {row.data.map((datum, j) => (
            <td key={j}>
              {datum}
            </td>
          ))}
          <td key="expander">
            {expanderRenderer(row, this.toggleExpandedRow)}
          </td>
        </tr>
        {
          row.expanded &&
          <tr className="tr-expand-content" aria-expanded="true">
            <td colSpan={numColumns}>
               {expandedRowRenderer(row, this.toggleExpandedRow)}
            </td>
          </tr>
        }
      </Fragment>
    )
  }
}

class ExpandableTable extends React.Component {
  render() {
    const { columns, rows, expanderRenderer, expandedRowRenderer } = this.props

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
            <ExpandableTableRow
              key={i}
              row={row}
              numColumns={numColumns}
              expanderRenderer={expanderRenderer}
              expandedRowRenderer={expandedRowRenderer} />
          ))}
        </tbody>
      </table>
    )
  }
}

export default ExpandableTable
