import React from 'react'
import { capitalize, compact, map, cloneDeep } from 'lodash'

import LeaseUpApplicationsTable from './LeaseUpApplicationsTable'
import LeaseUpApplicationsFilter from './LeaseUpApplicationsFilter'
import StatusModalWrapper from '~/components/organisms/StatusModalWrapper'

import appPaths from '~/utils/appPaths'
import { withContext } from './context'

const LeaseUpTableContainer = ({
  store: {
    listing,
    applications,
    statusModal,
    preferences,
    loading,
    handleOnFilter,
    handleOnFetchData,
    pages,
    rowsPerPage,
    atMaxPages,
    updateStatusModal,
    handleCreateStatusUpdate
  }
}) => {
  const closeStatusModal = () => {
    updateStatusModal({
      isOpen: false,
      showAlert: false
    })
  }

  const leaseUpStatusChangeHandler = (applicationPreferenceId, applicationId, status) => {
    updateStatusModal({
      applicationId: applicationId,
      applicationPreferenceId: applicationPreferenceId,
      isOpen: true,
      status: status
    })
  }

  const createStatusUpdate = async (submittedValues) => {
    updateStatusModal({ loading: true })

    const { applicationId } = statusModal
    const { status, subStatus } = submittedValues
    var comment = submittedValues.comment && submittedValues.comment.trim()
    const data = {
      status,
      comment,
      applicationId,
      ...(subStatus ? { subStatus } : {})
    }

    handleCreateStatusUpdate(data)
  }

  const buildRowData = (result) => {
    let rowData = cloneDeep(result)
    // get keys and remove empty values
    const accessibilityKeys = compact(Object.keys(result.has_ada_priorities_selected || []))

    if (accessibilityKeys && accessibilityKeys.length > 0) {
      rowData.accessibility = accessibilityKeys.map(key => capitalize(key.split('_')[0])).join(', ')
    }

    rowData.preference_rank = `${result.preference_record_type} ${result.preference_lottery_rank}`
    var prefNum = parseFloat(result.preference_order)
    var rankNum = parseFloat(result.preference_lottery_rank)
    rowData.rankOrder = prefNum + (rankNum * 0.0001)
    return rowData
  }

  const goToSupplementaryInfo = (listingId, rowInfo) => {
    window.location.href = appPaths.toApplicationSupplementals(rowInfo.original.application_id)
  }

  const rowsData = (applications) => map(applications, buildRowData)

  return (
    <>
      <LeaseUpApplicationsFilter preferences={preferences} onSubmit={handleOnFilter} loading={loading} />
      <LeaseUpApplicationsTable
        dataSet={rowsData(applications)}
        listingId={listing.id}
        onLeaseUpStatusChange={leaseUpStatusChangeHandler}
        onCellClick={goToSupplementaryInfo}
        loading={loading}
        onFetchData={handleOnFetchData}
        pages={pages}
        rowsPerPage={rowsPerPage}
        atMaxPages={atMaxPages}
      />
      <StatusModalWrapper
        {...statusModal}
        header='Update Status'
        submitButton='Update'
        onSubmit={createStatusUpdate}
        onClose={closeStatusModal} />
    </>
  )
}

export default withContext(LeaseUpTableContainer)
