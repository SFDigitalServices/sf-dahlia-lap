import React, { Fragment } from 'react'

import { slice, get } from 'lodash'

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

  render() {
    const { row, columns, expanderRenderer, expandedRowRenderer } = this.props
    const { expanded } = this.state

    const numColumns = columns.length
    const displayColumns = slice(columns, 0, numColumns - 1)

    return (
      <Fragment>
        <tr className="tr-expand" aria-expanded={this.state.expanded}>
          {displayColumns.map((column, j) => (
            <td key={j}>
              {column.Cell ?
                column.Cell({ row, column, index: j, value: get(row, column.accessor) })
                :
                get(row, column.accessor)
              }
            </td>
          ))}
          <td key="expander">
            {expanderRenderer &&  expanderRenderer(row, expanded, this.toggleExpandedRow)}
          </td>
        </tr>
        <tr className="tr-expand-content" aria-hidden={!expanded}>
          <td colSpan={numColumns} className="td-expand-nested no-padding">
            {expandedRowRenderer && expandedRowRenderer(row, this.toggleExpandedRow)}
          </td>
        </tr>
      </Fragment>
    )
  }
}

export default ExpandableTableRow
