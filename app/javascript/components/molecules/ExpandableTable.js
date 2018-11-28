import React, { Fragment } from 'react'
import classNames from 'classnames'

class ExpandableTableRow extends React.Component {
  constructor (props) {
    super(props)
    this.state = {expanded: false}
  }

  toggleExpandedRow = () => {
    this.setState((prevState) => {
      return {expanded: !prevState.expanded}
    })
  }

  render () {
    const { row, numColumns, expanderRenderer, expandedRowRenderer, original } = this.props
    const cells = row.map((datum, j) =>
      <td className={datum.classes ? datum.classes.join(' ') : ''} key={j}>{datum.content}</td>
    )

    return (
      <Fragment>
        <tr className='tr-expand' aria-expanded={this.state.expanded}>
          {cells}
          <td key='expander'>
            {expanderRenderer && expanderRenderer(row, this.state.expanded, this.toggleExpandedRow)}
          </td>
        </tr>
        <tr className='tr-expand-content' aria-hidden={!this.state.expanded}>
          <td colSpan={numColumns} className='td-expand-nested no-padding'>
            {expandedRowRenderer && expandedRowRenderer(row, this.toggleExpandedRow, original)}
          </td>
        </tr>
      </Fragment>
    )
  }
}

class ExpandableTable extends React.Component {
  render () {
    const { columns, rows, expanderRenderer, expandedRowRenderer, originals, classes } = this.props

    const numColumns = columns.length

    return (
      <table className={classNames('td-light td-plain th-plain', classes)} role='grid'>
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th key={i} scope='col' className={column.classes ? column.classes.join(' ') : ''}>
                {column.content}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <ExpandableTableRow
              key={i}
              idx={i}
              original={originals && originals[i]}
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

ExpandableTable.ExpanderButton = ({ onClick, label = 'Expand' }) => {
  return (
    <button
      type='button'
      className='button button-link action-link'
      onClick={onClick}>
      {label}
    </button>
  )
}

export default ExpandableTable
