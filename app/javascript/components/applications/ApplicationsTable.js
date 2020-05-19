import React from 'react'
import ReactTable from 'react-table'
import TableSubComponent from '~/components/atoms/TableSubComponent'
import PrettyTime from '../atoms/PrettyTime'
import appPaths from '~/utils/appPaths'
import { MAX_SERVER_LIMIT } from '~/utils/EagerPagination'

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

const ApplicationsTable = ({ applications, onFetchData, loading, pages, rowsPerPage, atMaxPages }) => {
  const maxPagesMsg = `Unfortunately, we can only display the first ${MAX_SERVER_LIMIT / rowsPerPage} pages of applications at this time. Please use the filters above to narrow your results.`
  const noDataText = atMaxPages ? maxPagesMsg : 'No rows found'
  const columns = [
    { Header: 'Application Number', accessor: 'name', headerClassName: 'td-min-narrow' },
    { Header: 'Listing Name', accessor: 'listing_name' },
    { Header: 'Lottery Date', accessor: 'listing_lottery_date', Cell: (cell) => (cell.value ? <PrettyTime time={cell.value} /> : null) },
    { Header: 'First Name', accessor: 'applicant.first_name' },
    { Header: 'Last Name', accessor: 'applicant.last_name' },
    { Header: 'Application Submitted Date', accessor: 'application_submitted_date' },
    { Header: 'Total Household size', accessor: 'total_household_size' },
    { Header: 'Application Submission Type', accessor: 'application_submission_type' }
  ]

  const sortBy = [ { id: 'number', desc: false } ]

  const getPaginationProps = () => {
    return {
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
      defaultPageSize={rowsPerPage}
      onFetchData={onFetchData}
      SubComponent={SubComponent}
      getPaginationProps={getPaginationProps}
      noDataText={noDataText}
    />
  )
}

export default ApplicationsTable
