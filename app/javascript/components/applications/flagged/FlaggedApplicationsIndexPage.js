import React from 'react'

import ErrorBoundary from 'components/atoms/ErrorBoundary'
import Loading from 'components/molecules/Loading'
import { useFlaggedApplications } from 'query/hooks/useFlaggedApplications'

import IndexTable from '../../IndexTable'
import TableLayout from '../../layouts/TableLayout'

const flaggedTableFields = {
  id: null,
  listing_name: {
    label: 'Listing Name'
  },
  rule_name: {
    label: 'Rule Name'
  },
  total_number_of_pending_review: {
    label: 'Total Number of Pending Review'
  },
  total_number_of_appealed: {
    label: 'Total Number of Appealed'
  }
}

const duplicatedTableFields = {
  id: null,
  listing_name: {
    label: 'Listing Name'
  },
  rule_name: {
    label: 'Rule Name'
  },
  total_number_of_duplicates: {
    label: 'Total_Number_of_Duplicates'
  }
}

const getTableFieldsForType = (type) => {
  if (type === 'duplicated') {
    return duplicatedTableFields
  } else if (type === 'pending') {
    return flaggedTableFields
  } else {
    throw new Error('Type is missing or unsupported')
  }
}

const FlaggedApplicationsIndexTable = ({ flaggedRecords, fields }) => {
  return (
    <IndexTable results={flaggedRecords} fields={fields} links={['View Flagged Applications']} />
  )
}

const FlaggedApplicationsIndexPage = ({ type }) => {
  const { data, isLoading, isError } = useFlaggedApplications(type)

  if (isError) {
    throw new Error('Failed to get Flagged Applications')
  }

  const tableFields = getTableFieldsForType(type)
  const title = data?.title
  const flaggedRecords = data?.flaggedRecords

  return (
    <ErrorBoundary>
      <Loading isLoading={isLoading} renderChildrenWhileLoading={false} loaderViewHeight='100vh'>
        <TableLayout pageHeader={{ title }}>
          <FlaggedApplicationsIndexTable flaggedRecords={flaggedRecords} fields={tableFields} />
        </TableLayout>
      </Loading>
    </ErrorBoundary>
  )
}

export default FlaggedApplicationsIndexPage
