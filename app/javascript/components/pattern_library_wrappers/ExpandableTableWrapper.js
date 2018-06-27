import React from 'react'

import ExpandableTable from '../molecules/ExpandableTable'

class ExpandableTableWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      rows: this.props.rows
    }
  }

  expanderRenderer = (row, i, expandedRowToggler) => {
    if (row.expanded) return

    return <button className="button button-link action-link" onClick={(e) => expandedRowToggler(i, 'expand')}>Expand</button>
  }

  expandedRowRenderer = (row, i, expandedRowToggler) => (
    <div className="app-editable expand-wide scrollable-table-nested">
      <div>Hello</div>
      <br/>
      <button className="button" onClick={(e) => (expandedRowToggler(i, 'close'))}>Close</button>
    </div>
  )

  toggleExpandedRow = (i, expansionState) => {
    this.setState((prevState) => {
      var updatedRows = prevState.rows.slice()
      updatedRows[i].expanded = expansionState === 'expand' ? true : false
      return {
        rows: updatedRows
      }
    })
  }

  render() {
    return (
      <ExpandableTable
        columns={this.props.columns}
        rows={this.state.rows}
        expanderRenderer={this.expanderRenderer}
        expandedRowRenderer={this.expandedRowRenderer}
        expandedRowToggler={this.toggleExpandedRow} />
    )
  }
}

export default ExpandableTableWrapper
