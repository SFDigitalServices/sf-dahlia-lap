import React from 'react'
import ReactTable from 'react-table'
import TableSubComponent from '~/components/atoms/TableSubComponent'
import PrettyTime from '../atoms/PrettyTime'
import appPaths  from '~/utils/appPaths'

const PAGE_SIZE = 20

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
      { Header: 'Application Number', accessor: 'name', headerClassName: 'td-min-narrow' },
      { Header: 'Listing Name', accessor: 'listing.name' },
      { Header: 'Lottery Date', accessor: 'listing.lottery_date', Cell: (cell) => ( <PrettyTime time={cell.value} /> ) },
      { Header: 'First Name', accessor: 'applicant.first_name' },
      { Header: 'Last Name', accessor: 'applicant.last_name' },
      { Header: 'Application Submitted Date', accessor: 'application_submitted_date' },
      { Header: 'Total Household size', accessor: 'total_household_size' },
      { Header: 'Application Submission Type', accessor: 'application_submission_type' }
    ]

  const sortBy = [ { id:'number', desc:false } ]

  const getPaginationProps = () => {
    return  {
      showPageSizeOptions: false
    }
  }

  return (
    <ReactTable
      manual
      data={applications}
      pages={pages}
      columns={columns}
      sortable={false}
      defaultSorted={sortBy}
      loading={loading}
      defaultPageSize={PAGE_SIZE}
      onFetchData={onFetchData}
      SubComponent={SubComponent}
      getPaginationProps={getPaginationProps} />
  )
}

export default ApplicationsTable
