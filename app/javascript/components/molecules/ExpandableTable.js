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
        <tr className="tr-expand" aria-expanded={row.expanded}>
          {row.data.map((datum, j) => (
            <td key={j}>
              {datum}
            </td>
          ))}
          <td key="expander">
            {expanderRenderer(row, this.toggleExpandedRow)}
          </td>
        </tr>
        <tr className="tr-expand-content" aria-hidden={!row.expanded}>
          <td colSpan={numColumns} className="td-expand-nested no-padding">
             {expandedRowRenderer(row, this.toggleExpandedRow)}
          </td>
        </tr>
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
