import React from 'react'
import { trim, map, cloneDeep } from 'lodash'

import LeaseUpApplicationsTable from './LeaseUpApplicationsTable'
import LeaseUpApplicationsFilter from './LeaseUpApplicationsFilter'
import StatusModalWrapper from '~/components/organisms/StatusModalWrapper'

import appPaths from '~/utils/appPaths'
import { withContext } from './context'

class LeaseUpTableContainer extends React.Component {
  closeStatusModal = () => {
    this.props.store.updateStatusModal({
      isOpen: false,
      showAlert: false
    })
  }

  leaseUpStatusChangeHandler = (applicationPreferenceId, applicationId, status) => {
    this.props.store.updateStatusModal({
      applicationId: applicationId,
      applicationPreferenceId: applicationPreferenceId,
      isOpen: true,
      status: status
    })
  }

  createStatusUpdate = async (submittedValues) => {
    this.props.store.updateStatusModal({ loading: true })

    const { applicationId } = this.props.store.statusModal
    const { status, subStatus } = submittedValues
    var comment = submittedValues.comment && submittedValues.comment.trim()
    const data = {
      status,
      comment,
      applicationId,
      ...(subStatus ? { subStatus } : {})
    }

    this.props.store.handleCreateStatusUpdate(data)
  }

  buildRowData (result) {
    let rowData = cloneDeep(result)

    if (trim(result.mailing_address)) {
      rowData.address = result.mailing_address
    } else {
      rowData.address = result.residence_address
    }

    rowData.preference_rank = `${result.preference_record_type} ${result.preference_lottery_rank}`
    var prefNum = parseFloat(result.preference_order)
    var rankNum = parseFloat(result.preference_lottery_rank)
    rowData.rankOrder = prefNum + (rankNum * 0.0001)
    return rowData
  }

  goToSupplementaryInfo = (listingId, rowInfo) => {
    window.location.href = appPaths.toApplicationSupplementals(rowInfo.original.application_id)
  }

  rowsData (applications) {
    const rowsData = map(applications, result => this.buildRowData(result))
    return rowsData
  }

  render () {
    const { store } = this.props
    const { listing, applications, statusModal, preferences } = store

    return (
      <div>
        <LeaseUpApplicationsFilter preferences={preferences} onSubmit={store.handleOnFilter} loading={store.loading} />
        <LeaseUpApplicationsTable
          dataSet={this.rowsData(applications)}
          listingId={listing.id}
          onLeaseUpStatusChange={this.leaseUpStatusChangeHandler}
          onCellClick={this.goToSupplementaryInfo}
          loading={store.loading}
          onFetchData={store.handleOnFetchData}
          pages={store.pages}
          rowsPerPage={store.rowsPerPage}
          atMaxPages={store.atMaxPages}
        />
        <StatusModalWrapper
          {...statusModal}
          header='Update Status'
          submitButton='Update'
          onSubmit={this.createStatusUpdate}
          onClose={this.closeStatusModal} />
      </div>
    )
  }
}

export default withContext(LeaseUpTableContainer)
