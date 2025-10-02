import React from 'react'

import { each, includes, last, cloneDeep, toLower } from 'lodash'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'

import appPaths from 'utils/appPaths'
import utils from 'utils/utils'

import IndexTableCell from './IndexTableCell'

// NOTE: some aspects of this component are hardcoded to work with Flagged Application Sets
class SpreadsheetIndexTable extends React.Component {
  state = {
    expanded: {},
    loading: {},
    // [...array] == clone array
    editData: [...this.props.results],
    persistedData: [...this.props.results]
  }

  columnData = () => {
    const { fields } = this.props
    const columns = []
    each(fields, (attrs, field) => {
      attrs = attrs || {}
      // don't show Id column
      if (toLower(field) === 'id') return
      if (toLower(field) === 'application') return
      const column = {
        id: field,
        accessor: (row) => row[field],
        Cell: (cellInfo) => {
          // we are "editing" this row if we have expanded it
          let editing = this.state.expanded[cellInfo.viewIndex]
          const lotteryStatus =
            this.state.persistedData[cellInfo.index]['Flagged_Record_Set.Listing.Lottery_Status']
          if (includes(['In Progress', 'Lottery Complete'], lotteryStatus)) {
            // don't allow editing based on certain lotteryStatus values
            editing = false
          }
          const onChange = this.onCellChange(cellInfo)
          const val = this.state.persistedData[cellInfo.index][cellInfo.column.id]
          const editVal = this.state.editData[cellInfo.index][cellInfo.column.id] || ''
          const props = { attrs, val, editVal, editing, onChange }
          return <IndexTableCell {...props} />
        }
      }
      if (attrs.minWidth) {
        column.minWidth = attrs.minWidth
      }
      if (attrs.label) {
        column.Header = attrs.label
      } else if (includes(field, '__r.')) {
        column.Header = utils.cleanField(last(field.split('__r.')))
      } else if (includes(field, '.')) {
        column.Header = utils.cleanField(last(field.split('.')))
      } else {
        column.Header = utils.cleanField(field)
      }
      columns.push(column)
    })
    return columns
  }

  // Columns must be defined outside of ReactTable render (https://github.com/tannerlinsley/react-table/issues/1266)
  columns = this.columnData()

  onCellChange = (cellInfo) => {
    return (e) => {
      const editData = [...this.state.editData]
      editData[cellInfo.index][cellInfo.column.id] = e.target.value
      this.setState({ editData })
    }
  }

  closeRow = (rowInfo, save = false) => {
    return async () => {
      // close the expanded/editing state
      const expanded = { ...this.state.expanded }
      expanded[rowInfo.viewIndex] = !expanded[rowInfo.viewIndex]
      let loading = { ...this.state.loading }
      loading[rowInfo.index] = true
      this.setState({ loading })

      // clone array
      let editData = [...this.state.editData]
      const persistedData = [...this.state.persistedData]

      if (save) {
        loading = { ...loading }
        loading[rowInfo.index] = false
        persistedData[rowInfo.index] = cloneDeep(editData[rowInfo.index])
        if (this.props.onSave) {
          await this.props.onSave(persistedData[rowInfo.index])
        }
        // ^^ await means that the setState won't happen until the call is made
        this.setState({ expanded, loading, persistedData })
      } else {
        loading = { ...loading }
        loading[rowInfo.index] = false
        editData = [...persistedData]
        this.setState({ expanded, loading, editData })
      }
    }
  }

  render() {
    const getTrProps = (state, rowInfo, column, instance) => {
      return {
        onClick: (e, handleOriginal) => {
          const expanded = this.state.expanded
          if (this.state.expanded[rowInfo.viewIndex]) {
            return
          } else {
            expanded[rowInfo.viewIndex] = true
          }
          this.setState({ expanded })
        }
      }
    }

    const flaggedApplicationRow = (row) => {
      const lotteryStatus = row.original.flagged_record.listing.lottery_status
      const viewApplicationLink = (
        <li>
          <a
            className='button secondary tiny'
            href={appPaths.toApplication(row.original.application)}
          >
            View Application
          </a>
        </li>
      )
      if (includes(['In Progress', 'Lottery Complete'], lotteryStatus)) {
        return (
          <ul className='subcomponent button-radio-group segmented-radios inline-group'>
            {viewApplicationLink}
          </ul>
        )
      }
      return (
        <ul className='subcomponent button-radio-group segmented-radios inline-group'>
          {viewApplicationLink}
          <li>
            <button
              disabled={this.state.loading[row.index]}
              onClick={this.closeRow(row, true)}
              className='button secondary tiny'
            >
              Save Changes
            </button>
          </li>
          <li>
            <button
              disabled={this.state.loading[row.index]}
              onClick={this.closeRow(row)}
              className='button secondary tiny'
            >
              Cancel
            </button>
          </li>
        </ul>
      )
    }

    // NOTE: sorting works oddly when expanded rows are open, so it is turned off
    return (
      <ReactTable
        columns={this.columns}
        data={this.state.persistedData}
        sortable={false}
        SubComponent={flaggedApplicationRow}
        getTrProps={getTrProps}
        expanded={this.state.expanded}
      />
    )
  }
}

SpreadsheetIndexTable.propTypes = {
  results: PropTypes.array,
  fields: PropTypes.object,
  onSave: PropTypes.func
}

SpreadsheetIndexTable.defaultProps = {
  onSave: null
}

export default SpreadsheetIndexTable
