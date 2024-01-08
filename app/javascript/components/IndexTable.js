import React, { useState } from 'react'

import { each, includes, last, uniqBy, map, sortBy } from 'lodash'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'

import appPaths from 'utils/appPaths'
import { filterMethod } from 'utils/reactTableUtils'
import utils from 'utils/utils'

import IndexTableCell from './IndexTableCell'

const IndexTable = ({ fields, results, links, page }) => {
  const [expanded, setExpanded] = useState({})

  const columnData = () => {
    const columns = []
    each(fields, (attrs, field) => {
      attrs = attrs || {}
      if (field === 'Id' || field === 'id') return
      const column = {
        id: field,
        accessor: (row) => row[field],
        Cell: (cellInfo) => {
          let val = results[cellInfo.index][cellInfo.column.id]
          if (cellInfo.column.Header.includes('Date')) {
            // cheap way of knowing when to parse date fields
            // only parse the date if the value is not undefined.
            val = val ? moment(val).format('L') : undefined
          }
          return <IndexTableCell {...{ attrs, val }} />
        },
        filterMethod: (filter, row) => filterMethod(filter, row)
      }
      if (attrs.minWidth) {
        column.minWidth = attrs.minWidth
      }
      if (attrs.label) {
        column.Header = attrs.label
      } else if (includes(field, '.')) {
        column.Header = utils.cleanField(last(field.split('.')))
      } else {
        column.Header = utils.cleanField(field)
      }
      // for Listings and Flagged/Duplicates Tab
      if (column.Header === 'Name') {
        column.filterable = true
      }
      if (column.Header === 'Last Name') {
        column.filterable = true
      }
      // for Applications Tab
      if (column.Header === 'Application Number') {
        column.filterable = true
      }
      // TO DO: update when Mobx is implemented so no need to pass page
      if (column.Header === 'Listing Name' && page === 'listing_index') {
        // Allow filtering by typing
        column.filterable = true
      }
      if (column.Header === 'Listing Name' && !(page === 'listing_index')) {
        // Filter via dropdown
        column.filterable = true
        column.filterMethod = (filter, row) => {
          if (filter.value === 'all') {
            return true
          }
          return row[filter.id] === filter.value
        }
        column.Filter = ({ filter, onChange }) => {
          const uniqListings = uniqBy(
            map(results, (result) => {
              return { name: result['listing.name'] || result.listing_name }
            }),
            'name'
          )
          const sortedUniqListings = sortBy(uniqListings, (listing) => {
            return listing.name
          })

          const listingOptions = []
          each(sortedUniqListings, (listing, i) => {
            listingOptions.push(
              <option value={listing.name} key={i}>
                {listing.name}
              </option>
            )
          })

          return (
            <select
              onChange={(event) => onChange(event.target.value)}
              style={{ width: '100%' }}
              value={filter ? filter.value : 'all'}
            >
              <option value='all'>Show All</option>
              {listingOptions}
            </select>
          )
        }
      }
      columns.push(column)
    })
    return columns
  }

  const getTrProps = (_, rowInfo) => ({
    onClick: () => {
      setExpanded({
        // toggle this row's expanded state onClick
        [rowInfo.viewIndex]: !expanded[rowInfo.viewIndex]
      })
    }
  })

  return (
    <ReactTable
      columns={columnData()}
      data={results}
      SubComponent={(row) => {
        const linkTags = []
        each(links, (link, i) => {
          let href = ''
          const originalId = row.original.Id || row.original.id
          if (link === 'View Listing') {
            href = appPaths.toListing(originalId)
          } else if (link === 'Add Application' && row.row.lottery_status === 'Not Yet Run') {
            href = appPaths.toApplicationNew(originalId)
          } else if (link === 'View Application') {
            href = appPaths.toApplication(originalId)
          } else if (link === 'View Flagged Applications') {
            href = appPaths.toApplicationsFlagged(originalId)
          }
          if (href) {
            linkTags.push(
              <li key={i}>
                <a className='button secondary tiny' href={href}>
                  {link}
                </a>
              </li>
            )
          }
        })
        return (
          <ul className='subcomponent button-radio-group segmented-radios inline-group'>
            {linkTags}
          </ul>
        )
      }}
      getTrProps={getTrProps}
      expanded={expanded}
    />
  )
}

IndexTable.propTypes = {
  results: PropTypes.array,
  fields: PropTypes.object,
  links: PropTypes.array
}

export default IndexTable
