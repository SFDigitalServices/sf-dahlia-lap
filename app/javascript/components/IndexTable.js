import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
// import moment from 'moment'
import ReactTable from 'react-table'
import utils from '../utils'
import IndexTableCell from './IndexTableCell'

class IndexTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: {},
      data: [...props.results]
    }
  }

  columnData = () => {
    let { fields } = this.props
    var columns = []
    _.each(fields, (attrs, field) => {
      attrs = attrs || {}
      if (field === 'Id') return
      let column = {
        id: field,
        accessor: (row) => (
          row[field]
        ),
        Cell: (cellInfo) => {
          let val = this.state.data[cellInfo.index][cellInfo.column.id]
          return <IndexTableCell {...{ attrs, val }} />
        },
        filterMethod: (filter, row) => {
          return (
            // do case insensitive RegExp match instead of the default "startsWith"
            row[filter.id].match(new RegExp(filter.value, 'ig'))
          )
        }
      }
      if (attrs.minWidth) {
        column.minWidth = attrs.minWidth
      }
      if (attrs.label) {
        column.Header = attrs.label
      } else if (_.includes(field, '.')) {
        column.Header = utils.cleanField(_.last(field.split('.')))
      } else {
        column.Header = utils.cleanField(field)
      }
      // for Listings and Flagged/Duplicates Tab
      if (column.Header == 'Name') {
        column.filterable = true
      }
      // for Applications Tab
      if (column.Header === 'Listing Name') {
        column.filterable = true
        column.filterMethod = (filter, row) => {
          if (filter.value === "all") {
            return true;
          }
          return row[filter.id] == filter.value
        },
        column.Filter = ({ filter, onChange }) => {
          let listingOptions = []
          let i = 0
          let listingNames = []
          listingNames = _.uniq(_.map(this.props.results, 'Listing.Name'))
          _.each(listingNames, (name) => {
            listingOptions.push(
              <option value={name} key={i++}>{name}</option>
            )
          })
          return (
            <select
              onChange={event => onChange(event.target.value)}
              style={{ width: "100%" }}
              value={filter ? filter.value : "all"}
            >
              <option value="all">Show All</option>
              {listingOptions}
            </select>
          )
        }
      }
      columns.push(column)
    })
    return columns
  }

  render() {
    let { links } = this.props
    var getTrProps = (state, rowInfo, column, instance) => {
      return {
        onClick: (e, handleOriginal) => {
          let expanded = {
            // toggle this row's expanded state onClick
            [rowInfo.viewIndex]: !this.state.expanded[rowInfo.viewIndex]
          }
          this.setState({ expanded })
        }
      }
    }


    return (
      <ReactTable
        columns={this.columnData()}
        data={this.state.data}
        defaultSorted={[
          {
            id: "Listing__r.Lottery_Date__c",
            desc: true
          }
        ]}
        SubComponent={row => {
          let linkTags = []
          let i = 0
          _.each(links, (link) => {
            let href = ''
            if (link === 'View Listing') {
              href = `/listings/${row.original.Id}`
            } else if (link === 'Add Application' && row.original.Lottery_Status !== 'Lottery Complete') {
              href = `/listings/${row.original.Id}/applications/new`
            } else if (link === 'View Application') {
              href = `/applications/${row.original.Id}`
            } else if (link === 'View Flagged Applications') {
              href = `/flagged_record_sets/${row.original.Id}/flagged_applications`
            }
            if (href) {
              linkTags.push(
                <li key={i++}>
                  <a className="button secondary tiny" href={href}>
                    {link}
                  </a>
                </li>
              )
            }
          })
          return (
            <ul className="subcomponent button-radio-group segmented-radios inline-group">
              {linkTags}
            </ul>
          )
        }}
        getTrProps={getTrProps}
        expanded={this.state.expanded}
      />
    )
  }
}


IndexTable.propTypes = {
  results: PropTypes.array,
  fields: PropTypes.object,
  links: PropTypes.array
}

export default IndexTable
