import React from 'react'
import PropTypes from 'prop-types'
import { each, includes, last, cloneDeep, toLower } from 'lodash'
import ReactTable from 'react-table'
import utils from '~/utils/utils'
import apiService from '~/apiService'
import IndexTableCell from './IndexTableCell'

// NOTE: some aspects of this component are hardcoded to work with Flagged Application Sets
class SpreadsheetIndexTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: {},
      loading: {},
      // [...array] == clone array
      editData: [...props.results],
      persistedData: [...props.results],
    }
  }

  columnData = () => {
    let { fields } = this.props
    var columns = []
    each(fields, (attrs, field) => {
      attrs = attrs || {}
      // don't show Id column
      if (toLower(field) === 'id') return
      if (toLower(field) === 'application') return
      let column = {
        id: field,
        accessor: (row) => (
          row[field]
        ),
        Cell: (cellInfo) => {
          // we are "editing" this row if we have expanded it
          let editing = this.state.expanded[cellInfo.viewIndex]
          let lotteryStatus = this.state.persistedData[cellInfo.index]['Flagged_Record_Set.Listing.Lottery_Status']
          if (includes(['In Progress', 'Lottery Complete'], lotteryStatus)) {
            // don't allow editing based on certain lotteryStatus values
            editing = false
          }
          let onChange = this.onCellChange(cellInfo)
          let val = this.state.persistedData[cellInfo.index][cellInfo.column.id]
          let editVal = this.state.editData[cellInfo.index][cellInfo.column.id] || ''
          let props = { attrs, val, editVal, editing, onChange }
          return (
            <IndexTableCell {...props} />
          )
        }
      }
      if (attrs.minWidth) {
        column.minWidth = attrs.minWidth
      }
      if (attrs.label) {
        column.Header = attrs.label
      } else if (includes(field, '__r.')) {
        column.Header = utils.cleanField(last(field.split('__r.')))
      }
        else if (includes(field, '.')) {
        column.Header = utils.cleanField(last(field.split('.')))
      } else {
        column.Header = utils.cleanField(field)
      }
      columns.push(column)
    })
    return columns
  }

  onCellChange = (cellInfo) => {
    return (e) => {
      var editData = [...this.state.editData]
      editData[cellInfo.index][cellInfo.column.id] = e.target.value
      this.setState({ editData })
    }
  }

  closeRow = (rowInfo, save = false) => {
    return async () => {
      // close the expanded/editing state
      let expanded = {...this.state.expanded}
      expanded[rowInfo.viewIndex] = !expanded[rowInfo.viewIndex]
      let loading = {...this.state.loading}
      loading[rowInfo.index] = true
      this.setState({ loading })

      // clone array
      let editData = [...this.state.editData]
      let persistedData = [...this.state.persistedData]

      if (save) {
        // console.log(`saving ${rowInfo.index}.....`)
        loading = {...loading}
        loading[rowInfo.index] = false
        persistedData[rowInfo.index] = cloneDeep(editData[rowInfo.index])
        await apiService.updateFlaggedApplication(persistedData[rowInfo.index])
        // ^^ await means that the setState won't happen until the call is made
        this.setState({ expanded, loading, persistedData })
      } else {
        // console.log(`canceling ${rowInfo.index}.....`)
        loading = {...loading}
        loading[rowInfo.index] = false
        editData = [...persistedData]
        this.setState({ expanded, loading, editData })
      }
    }
  }

  render() {
    var getTrProps = (state, rowInfo, column, instance) => {
      return {
        onClick: (e, handleOriginal) => {
          let expanded = this.state.expanded
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
      // let lotteryStatus = row.original['Flagged_Record_Set.Listing.Lottery_Status']
      let lotteryStatus = row.original.flagged_record.listing.lottery_status
      let viewApplicationLink = (
        <li>
          <a className="button secondary tiny" href={`/applications/${row.original.application}`}>
            View Application
          </a>
        </li>
      )
      if (includes(['In Progress', 'Lottery Complete'], lotteryStatus)) {
        return (
          <ul className="subcomponent button-radio-group segmented-radios inline-group">
            {viewApplicationLink}
          </ul>
        )
      }
      return (
        <ul className="subcomponent button-radio-group segmented-radios inline-group">
          {viewApplicationLink}
          <li>
            <button disabled={this.state.loading[row.index]} onClick={this.closeRow(row, true)} className="button secondary tiny">
              Save Changes
            </button>
          </li>
          <li>
            <button disabled={this.state.loading[row.index]} onClick={this.closeRow(row)} className="button secondary tiny">
              Cancel
            </button>
          </li>
        </ul>
      )
    }

    // NOTE: sorting works oddly when expanded rows are open, so it is turned off
    return (
      <ReactTable
        columns={this.columnData()}
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
  fields: PropTypes.object
}

export default SpreadsheetIndexTable
