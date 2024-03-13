import React, { useState } from 'react'

import ErrorBoundary from 'components/atoms/ErrorBoundary'
import Loading from 'components/molecules/Loading'
import { useAsyncOnMount } from 'utils/customHooks'
import { fetchAndMapFlaggedApplicationsByRecordSet } from 'utils/flaggedAppRequestUtils'

import TableLayout from '../../layouts/TableLayout'
import SpreadsheetIndexTable from '../../SpreadsheetIndexTable'

const tableFields = {
  id: {
    label: 'Id'
  },
  application: {
    label: 'Application'
  },
  application_name: {
    label: 'App Number'
  },
  flagged_record_set_rule_name: {
    label: 'Rule Name'
  },
  primary_application_applicant_name: {
    label: 'Primary Applicant Name'
  },
  flagged_record_set_listing_lottery_status: {
    label: 'Lottery Status'
  },
  review_status: {
    label: 'Review Status',
    editable: true,
    editable_options: [
      'Pending Review',
      'Reviewed - Keep in Lottery',
      'Reviewed - Remove from Lottery',
      'Appealed'
    ]
  },
  comments: {
    label: 'Comments',
    editable: true
  }
}

const FlaggedApplicationsShowPage = ({ recordSetId }) => {
  const [loading, setLoading] = useState(true)
  const [flaggedRecords, setFlaggedRecords] = useState(undefined)
  useAsyncOnMount(() => fetchAndMapFlaggedApplicationsByRecordSet(recordSetId), {
    onSuccess: ({ flaggedRecords }) => {
      setFlaggedRecords(flaggedRecords)
    },
    onFail: (error) => {
      throw new Error(`Failed to get Flagged Applications by record set id: ${error}`)
    },
    onComplete: () => {
      setLoading(false)
    }
  })
  const pageHeader = {
    title: 'Flagged Application Set'
  }

  return (
    <ErrorBoundary>
      <Loading isLoading={loading} renderChildrenWhileLoading={false} loaderViewHeight='100vh'>
        <TableLayout pageHeader={pageHeader}>
          <SpreadsheetIndexTable results={flaggedRecords} fields={tableFields} />
        </TableLayout>
      </Loading>
    </ErrorBoundary>
  )
}

export default FlaggedApplicationsShowPage
