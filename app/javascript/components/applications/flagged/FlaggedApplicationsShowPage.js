import React from 'react'

import ErrorBoundary from 'components/atoms/ErrorBoundary'
import Loading from 'components/molecules/Loading'
import {
  useFlaggedApplicationsByRecordSet,
  useUpdateFlaggedApplication
} from 'query/hooks/useFlaggedApplications'

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
  const { data, isLoading, isError } = useFlaggedApplicationsByRecordSet(recordSetId)
  const updateFlaggedApplication = useUpdateFlaggedApplication({ recordSetId })

  if (isError) {
    throw new Error('Failed to get Flagged Applications by record set id')
  }

  const flaggedRecords = data?.flaggedRecords
  const pageHeader = { title: 'Flagged Application Set' }

  return (
    <ErrorBoundary>
      <Loading isLoading={isLoading} renderChildrenWhileLoading={false} loaderViewHeight='100vh'>
        <TableLayout pageHeader={pageHeader}>
          <SpreadsheetIndexTable
            results={flaggedRecords}
            fields={tableFields}
            onSave={(payload) => updateFlaggedApplication.mutateAsync(payload)}
          />
        </TableLayout>
      </Loading>
    </ErrorBoundary>
  )
}

export default FlaggedApplicationsShowPage
