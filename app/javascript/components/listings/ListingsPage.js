import React from 'react'

import ErrorBoundary from 'components/atoms/ErrorBoundary'

import IndexTable from '../IndexTable'
import TableLayout from '../layouts/TableLayout'

const tableFields = {
  id: null,
  name: {
    label: 'Listing Name',
    minWidth: 225
  },
  application_due_date: {
    type: 'date',
    label: 'Application Due Date'
  },
  lottery_date: {
    type: 'date',
    label: 'Lottery Date'
  },
  lottery_results_date: {
    type: 'date',
    label: 'Lottery Results Date'
  },
  lottery_status: {
    label: 'Lottery Status'
  },
  nflagged_applications: {
    label: 'Flagged Applications'
  },
  in_lottery: {
    label: 'Applications In Lottery'
  }
}

const ListingsPageTable = ({ page, listings, fields }) => {
  return (
    <IndexTable
      page={page}
      results={listings}
      fields={fields}
      links={['View Listing', 'Add Application', 'Lease Ups']}
    />
  )
}

const layout = {
  pageHeader: {
    title: 'Listings'
  }
}

const ListingsPage = ({ page, listings }) => {
  return (
    <ErrorBoundary>
      <TableLayout {...layout}>
        <ListingsPageTable page={page} listings={listings} fields={tableFields} />
      </TableLayout>
    </ErrorBoundary>
  )
}

export default ListingsPage
