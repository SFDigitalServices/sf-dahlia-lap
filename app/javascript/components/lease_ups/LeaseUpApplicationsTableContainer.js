import React from 'react'

import { capitalize, compact, map, cloneDeep } from 'lodash'

import StatusModalWrapper from 'components/organisms/StatusModalWrapper'
import appPaths from 'utils/appPaths'

import { withContext } from './context'
import LeaseUpApplicationsFilterContainer from './LeaseUpApplicationsFilterContainer'
import LeaseUpApplicationsTable from './LeaseUpApplicationsTable'

const LeaseUpTableContainer = ({
  store: {
    listingId,
    applications,
    statusModal,
    preferences,
    loading,
    handleOnFilter,
    handleOnFetchData,
    pages,
    rowsPerPage,
    atMaxPages,
    handleCloseStatusModal,
    onSubmitStatusModal,
    bulkCheckboxesState,
    onBulkCheckboxClick,
    handleLeaseUpStatusChange
  }
}) => {
  const buildRowData = (result) => {
    const rowData = cloneDeep(result)
    // get keys and remove empty values
    const accessibilityKeys = compact(Object.keys(result.has_ada_priorities_selected || []))

    if (accessibilityKeys && accessibilityKeys.length > 0) {
      rowData.accessibility = accessibilityKeys
        .map((key) => capitalize(key.split('_')[0]))
        .join(', ')
    }

    rowData.preference_rank = `${result.preference_record_type} ${result.preference_lottery_rank}`
    var prefNum = parseFloat(result.preference_order)
    var rankNum = parseFloat(result.preference_lottery_rank)
    rowData.rankOrder = prefNum + rankNum * 0.0001
    return rowData
  }

  const goToSupplementaryInfo = (listingId, rowInfo) => {
    window.location.href = appPaths.toApplicationSupplementals(rowInfo.original.application_id)
  }

  const rowsData = (applications) => map(applications, buildRowData)
  return (
    <>
      <LeaseUpApplicationsFilterContainer
        preferences={preferences}
        onSubmit={handleOnFilter}
        loading={loading}
        onBulkLeaseUpStatusChange={handleLeaseUpStatusChange}
      />
      <LeaseUpApplicationsTable
        dataSet={rowsData(applications)}
        listingId={listingId}
        onLeaseUpStatusChange={handleLeaseUpStatusChange}
        onCellClick={goToSupplementaryInfo}
        loading={loading}
        onFetchData={handleOnFetchData}
        pages={pages}
        rowsPerPage={rowsPerPage}
        atMaxPages={atMaxPages}
        bulkCheckboxesState={bulkCheckboxesState}
        onBulkCheckboxClick={onBulkCheckboxClick}
      />
      <StatusModalWrapper
        alertMsg={statusModal.alertMsg}
        isBulkChange={statusModal.isBulkChange}
        isOpen={statusModal.isOpen}
        loading={statusModal.loading}
        onClose={handleCloseStatusModal}
        onSubmit={onSubmitStatusModal}
        showAlert={statusModal.showAlert}
        status={statusModal.status}
        submitButton='Update'
        title='Update Status'
        bulkUpdateCount={statusModal.isBulkChange ? statusModal.applicationIds.length : null}
      />
    </>
  )
}

export default withContext(LeaseUpTableContainer)
