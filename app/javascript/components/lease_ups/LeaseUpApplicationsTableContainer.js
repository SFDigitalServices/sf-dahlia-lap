import React, { useEffect, useState } from 'react'

import { capitalize, compact, map, cloneDeep } from 'lodash'

import StatusModalWrapper from 'components/organisms/StatusModalWrapper'
import { LISTING_TYPE_FIRST_COME_FIRST_SERVED } from 'utils/consts'

import { withContext } from './context'
import LeaseUpApplicationsFilterContainer from './LeaseUpApplicationsFilterContainer'
import LeaseUpApplicationsTable from './LeaseUpApplicationsTable'
import { getApplicationRanks } from './utils/leaseUpRequestUtils'

// Format applications for the Lease Up applications table
export const buildRowData = (application) => {
  const rowData = cloneDeep(application)

  // get keys and remove empty values
  const accessibilityKeys = compact(Object.keys(application.has_ada_priorities_selected || []))

  if (accessibilityKeys && accessibilityKeys.length > 0) {
    rowData.accessibility = accessibilityKeys.map((key) => capitalize(key.split('_')[0])).join(', ')
  }

  // Override the key we display for certain cases
  let prefKey
  if (application.preference_name?.includes('General')) {
    prefKey = 'General'
  } else if (application.preference_name?.includes('Right to Return')) {
    prefKey = 'RtR'
  } else {
    // TODO: DAH-1904 - clean up references to unused prefrenece type field
    prefKey = application.custom_preference_type
      ? application.custom_preference_type
      : application.preference_record_type
  }

  rowData.preference_rank = `${prefKey} ${application.preference_lottery_rank}`
  const prefNum = parseFloat(application.preference_order)
  const rankNum = parseFloat(application.preference_lottery_rank)
  rowData.rankOrder = prefNum + rankNum * 0.0001
  return rowData
}

const LeaseUpTableContainer = ({
  store: {
    applications,
    atMaxPages,
    bulkCheckboxesState,
    listingId,
    listingType,
    loading,
    onBulkCheckboxClick,
    onCloseStatusModal,
    onFilter,
    onLeaseUpStatusChange,
    onSubmitStatusModal,
    onClearSelectedApplications,
    onSelectAllApplications,
    pages,
    preferences,
    rowsPerPage,
    statusModal
  }
}) => {
  const [applicationRanks, setApplicationRanks] = useState(null)

  useEffect(() => {
    if (listingType === LISTING_TYPE_FIRST_COME_FIRST_SERVED) {
      getApplicationRanks(listingId).then((response) => {
        setApplicationRanks(response)
      })
    }
  }, [listingId, listingType])

  return (
    <>
      <LeaseUpApplicationsFilterContainer
        listingType={listingType}
        preferences={preferences}
        onSubmit={onFilter}
        loading={loading}
        bulkCheckboxesState={bulkCheckboxesState}
        onClearSelectedApplications={onClearSelectedApplications}
        onSelectAllApplications={onSelectAllApplications}
        onBulkLeaseUpStatusChange={(val) => onLeaseUpStatusChange(val, null, false)}
        onBulkLeaseUpCommentChange={(val) => onLeaseUpStatusChange(null, null, true)}
      />
      {!loading && (
        <LeaseUpApplicationsTable
          dataSet={map(applications, buildRowData)}
          listingId={listingId}
          listingType={listingType}
          onLeaseUpStatusChange={onLeaseUpStatusChange}
          pages={pages}
          rowsPerPage={rowsPerPage}
          atMaxPages={atMaxPages}
          bulkCheckboxesState={bulkCheckboxesState}
          onBulkCheckboxClick={onBulkCheckboxClick}
          ranks={applicationRanks}
        />
      )}
      <StatusModalWrapper
        alertMsg={statusModal.alertMsg}
        isBulkUpdate={statusModal.isBulkUpdate}
        isOpen={statusModal.isOpen}
        loading={statusModal.loading}
        numApplicationsToUpdate={
          statusModal.applicationsData ? Object.keys(statusModal.applicationsData).length : 1
        }
        onAlertCloseClick={statusModal.onAlertCloseClick}
        onClose={onCloseStatusModal}
        onSubmit={onSubmitStatusModal}
        showAlert={statusModal.showAlert}
        status={statusModal.status}
        submitButton={statusModal.isCommentModal ? 'Submit' : 'Update'}
        title={statusModal.isCommentModal ? 'Add Comment' : 'Update Status'}
        isCommentModal={statusModal.isCommentModal}
      />
    </>
  )
}

export default withContext(LeaseUpTableContainer)
