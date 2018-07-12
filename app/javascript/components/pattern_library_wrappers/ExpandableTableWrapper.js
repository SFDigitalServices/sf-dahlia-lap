import React from 'react'

import ExpandableTable from '../molecules/ExpandableTable'

class ExpandableTableWrapper extends React.Component {
  expanderRenderer = (row, expanded, expandedRowToggler) => {
    if (expanded) return

    return <button className="button button-link action-link" onClick={(e) => expandedRowToggler()}>Expand</button>
  }

  expandedRowRenderer = (row, expandedRowToggler) => (
    <div className="app-editable expand-wide scrollable-table-nested">
      <div>Hello</div>
      <br/>
      <button className="button" onClick={(e) => (expandedRowToggler())}>Close</button>
    </div>
  )

  render() {
    const { columns, rows } = this.props

    return (
      <ExpandableTable
        columns={columns}
        rows={rows}
        expanderRenderer={this.expanderRenderer}
        expandedRowRenderer={this.expandedRowRenderer} />
    )
  }
}

export default ExpandableTableWrapper
