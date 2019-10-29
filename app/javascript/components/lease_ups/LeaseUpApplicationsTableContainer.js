import React from 'react'
import { trim, map, cloneDeep } from 'lodash'

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
  } }) => {
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

    if (trim(result.mailing_address)) {
      rowData.address = result.mailing_address
    } else {
      rowData.address = result.residence_address
    }

    rowData.preference_rank = `${result.preference_record_type} ${result.preference_lottery_rank || result.preference_all_lottery_rank}`
    var prefNum = parseFloat(result.preference_order)
    var rankNum = parseFloat(result.preference_lottery_rank || result.preference_all_lottery_rank)
    rowData.rankOrder = prefNum + (rankNum * 0.0001)
    return rowData
  }

  const goToSupplementaryInfo = (listingId, rowInfo) => {
    window.location.href = appPaths.toApplicationSupplementals(rowInfo.original.application_id)
  }

  const rowsData = (applications) => map(applications, buildRowData)

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}

export default withContext(LeaseUpTableContainer)
