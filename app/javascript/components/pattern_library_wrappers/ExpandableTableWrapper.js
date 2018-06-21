import React from 'react'
import { includes } from 'lodash'

import ExpandableTable from '../molecules/ExpandableTable'

class ExpandableTableWrapper extends React.Component {
  mapColumns = () => (
    this.props.columns.map((column) => {
      if (column.expander) {
        column.expander = (isExpanded) => (
          isExpanded ? 'edit' : 'nope'
        )
      }

      return column
    })
  )

  mapData = () => (
    // return [{}, {}]
    // this.props.data.map((datum) => {
    //   var rowPair = {
    //     row: {...datum}
    //   }
    //
    //   if (_.includes(datum, 'expandable')) {
    //
    //   }
    //
    //   return row
    // })
  )

  expandedRowRenderer = () => (
    // return [{}, {}]
    // this.props.data.map((datum) => {
    //   var rowPair = {
    //     row: {...datum}
    //   }
    //
    //   if (_.includes(datum, 'expandable')) {
    //
    //   }
    //
    //   return row
    // })
  )

  render() {
    console.log(this.props.columns)
    console.log(this.mapColumns())
    console.log(this.props.data)

    return (
      <ExpandableTable columns={this.mapColumns()} data={this.props.data} expandedRowRenderer={this.expandedRowRenderer}/>
    )
  }
}

export default ExpandableTableWrapper
