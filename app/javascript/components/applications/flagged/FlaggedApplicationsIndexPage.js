import React, { useState } from 'react'

import ErrorBoundary from 'components/atoms/ErrorBoundary'
import Loading from 'components/molecules/Loading'
import { useAsyncOnMount } from 'utils/customHooks'

import IndexTable from '../../IndexTable'
import TableLayout from '../../layouts/TableLayout'
import { fetchFlaggedApplications } from '../applicationRequestUtils'

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
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState(undefined)
  const [flaggedRecords, setFlaggedRecords] = useState(undefined)
  useAsyncOnMount(() => fetchFlaggedApplications(type), {
    onSuccess: ({ title, flaggedRecords }) => {
      setTitle(title)
      setFlaggedRecords(flaggedRecords)
    },
    onFail: (error) => {
      throw new Error(`Failed to get Flagged Applications: ${error}`)
    },
    onComplete: () => {
      setLoading(false)
    }
  })

  const tableFields = getTableFieldsForType(type)
  return (
    <ErrorBoundary>
      <Loading isLoading={loading} renderChildrenWhileLoading={false} loaderViewHeight='100vh'>
        <TableLayout pageHeader={{ title }}>
          <FlaggedApplicationsIndexTable flaggedRecords={flaggedRecords} fields={tableFields} />
        </TableLayout>
      </Loading>
    </ErrorBoundary>
  )
}

export default FlaggedApplicationsIndexPage
