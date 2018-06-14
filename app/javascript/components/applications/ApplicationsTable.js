import React from 'react'
import ReactTable from 'react-table'
import { uniqBy, map, sortBy } from 'lodash'
import moment from 'moment'

import IndexTable from '../IndexTable'
import TableSubComponent from '~/components/atoms/TableSubComponent'
import PrettyTime from '../atoms/PrettyTime'
import appPaths  from '~/utils/appPaths'

const PAGE_SIZE = 20

// const ApplicationsTable = ({ applications, fields }) => {
//   return (
//     <IndexTable
//       results={applications}
//       fields= {fields}
//       links={['View Application'] } />
//   )
// }

const buildListingNameList = (applications) => {
  const uniqListings = uniqBy(map(applications, (result) => {
    return {
      name: result.listing.name,
      lotteryDate: moment(result.listing.lottery_date)
    }
  }), 'name')
  const sortedUniqListings = sortBy(uniqListings, (listing) => {
    return listing.lotteryDate
  })

  return sortedUniqListings
}

const ListingNameFilter = ({ applications, filter, onChange }) => {
  const listingNames = buildListingNameList(applications)
  const listingOptions = map(listingNames, (listing, idx) => {
    return <option value={listing.name} key={idx}>{listing.name}</option>
  })
  const selectFilterValue = filter ? filter.value : (listingNames[0] ? listingNames[0].name : undefined)

  return (
    <select
      onChange={event => onChange(event.target.value)}
      style={{ width: "100%" }}
      value={selectFilterValue}>
      <option value="all">Show All</option>
      {listingOptions}
    </select>
  )
}

const SubComponent = (row) => (
  <TableSubComponent items={
    [{
      title: 'View Application',
      link: appPaths.toApplication(row.original.id)
    }]
  } />
)

/******************************************/
/*      Presenter                         */
/******************************************/

const ApplicationsTable = ({ applications, onFetchData, loading, pages }) => {
  const columns = [
      { Header: 'Application Number', accessor: 'number', headerClassName: 'td-min-narrow', filterable: true },
      { Header: 'Listing Name', accessor: 'listing.name', filterable: true, Filter: (attrs) => <ListingNameFilter applications={applications} {...attrs} /> },
      { Header: 'Lottery Date', accessor: 'listing.lottery_date', Cell: (cell) => ( <PrettyTime time={cell.value} /> ) },
      { Header: 'First Name', accessor: 'applicant.first_name' },
      { Header: 'Last Name', accessor: 'applicant.last_name' },
      { Header: 'Application Submitted Date', accessor: 'submitted_date' },
      { Header: 'Total Household size', accessor: 'total_house_hold_size' },
      { Header: 'Application Submission Type', accessor: 'submission_type' }
    ]

  const sortBy = [ { id:'number', desc:false } ]

  return (
    <ReactTable
      manual
      data={applications}
      pages={pages}
      columns={columns}
      defaultSorted={sortBy}
      loading={loading}
      defaultPageSize={PAGE_SIZE}
      onFetchData={onFetchData}
      SubComponent={SubComponent} />
  )
}

export default ApplicationsTable
