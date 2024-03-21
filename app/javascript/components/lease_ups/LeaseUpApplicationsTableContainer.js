import React from 'react'

import { capitalize, compact, map, cloneDeep } from 'lodash'

import StatusModalWrapper from 'components/organisms/StatusModalWrapper'

import { withContext } from './context'
import LeaseUpApplicationsFilterContainer from './LeaseUpApplicationsFilterContainer'
import LeaseUpApplicationsTable from './LeaseUpApplicationsTable'

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
    prefKey = application.custom_preference_type
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
  return (
    <>
      <LeaseUpApplicationsFilterContainer
        preferences={preferences}
        onSubmit={onFilter}
        loading={loading}
        bulkCheckboxesState={bulkCheckboxesState}
        onClearSelectedApplications={onClearSelectedApplications}
        onSelectAllApplications={onSelectAllApplications}
        onBulkLeaseUpStatusChange={(val) => onLeaseUpStatusChange(val, null, false)}
        onBulkLeaseUpCommentChange={(val) => onLeaseUpStatusChange(null, null, true)}
      />
      <LeaseUpApplicationsTable
        dataSet={map(applications, buildRowData)}
        listingId={listingId}
        onLeaseUpStatusChange={onLeaseUpStatusChange}
        loading={loading}
        pages={pages}
        rowsPerPage={rowsPerPage}
        atMaxPages={atMaxPages}
        bulkCheckboxesState={bulkCheckboxesState}
        onBulkCheckboxClick={onBulkCheckboxClick}
      />
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
