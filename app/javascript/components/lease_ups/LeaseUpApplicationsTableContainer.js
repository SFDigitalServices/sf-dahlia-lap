import React, { useContext } from 'react'

import { capitalize, compact, map, cloneDeep } from 'lodash'
import { useHistory } from 'react-router-dom'

import StatusModalWrapper from 'components/organisms/StatusModalWrapper'
import { LeaseUpDispatchContext } from 'stores/LeaseUpProvider'
import { ACTION_SET_CURRENT_APPLICATION } from 'stores/LeaseUpReducer'
import appPaths from 'utils/appPaths'

import { withContext } from './context'
import LeaseUpApplicationsFilterContainer from './LeaseUpApplicationsFilterContainer'
import LeaseUpApplicationsTable from './LeaseUpApplicationsTable'

const LeaseUpTableContainer = ({
  store: {
    applications,
    atMaxPages,
    bulkCheckboxesState,
    listingId,
    loading,
    onBulkCheckboxClick,
    onCloseStatusModal,
    onFetchData,
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

  const history = useHistory()
  const dispatch = useContext(LeaseUpDispatchContext)

  const handleCellClick = (rowInfo) => {
    const application = rowInfo.original
    dispatch({
      type: ACTION_SET_CURRENT_APPLICATION,
      data: {
        id: application.application_id,
        number: application.application_number,
        applicantFirstName: application.first_name,
        applicantLastName: application.last_name
      }
    })
    history.push(appPaths.toApplicationSupplementals(rowInfo.original.application_id))
  }

  const rowsData = (applications) => map(applications, buildRowData)
  return (
    <>
      <LeaseUpApplicationsFilterContainer
        preferences={preferences}
        onSubmit={onFilter}
        loading={loading}
        bulkCheckboxesState={bulkCheckboxesState}
        onClearSelectedApplications={onClearSelectedApplications}
        onSelectAllApplications={onSelectAllApplications}
        onBulkLeaseUpStatusChange={(val) => onLeaseUpStatusChange(val, null)}
      />
      <LeaseUpApplicationsTable
        dataSet={rowsData(applications)}
        listingId={listingId}
        onLeaseUpStatusChange={onLeaseUpStatusChange}
        onCellClick={handleCellClick}
        loading={loading}
        onFetchData={onFetchData}
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
        numApplicationsToUpdate={statusModal.applicationIds?.length}
        onAlertCloseClick={statusModal.onAlertCloseClick}
        onClose={onCloseStatusModal}
        onSubmit={onSubmitStatusModal}
        showAlert={statusModal.showAlert}
        status={statusModal.status}
        submitButton='Update'
        title='Update Status'
      />
    </>
  )
}

export default withContext(LeaseUpTableContainer)
