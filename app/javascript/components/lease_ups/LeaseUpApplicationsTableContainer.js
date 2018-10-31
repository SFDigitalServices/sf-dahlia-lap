import React from 'react'
import { trim, map, cloneDeep } from 'lodash'
import LeaseUpApplicationsTable from './LeaseUpApplicationsTable'
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

  setStatusModalStatus = (value) => this.props.store.updateStatusModal({status: value})

  hideStatusModalAlert = () => this.props.store.updateStatusModal('showAlert', false)

  leaseUpStatusChangeHandler = (applicationPreferenceId, applicationId, status) => {
    this.props.store.updateStatusModal({
      applicationId: applicationId,
      applicationPreferenceId: applicationPreferenceId,
      isOpen: true,
      status: status
    })
  }

  createStatusUpdate = async (submittedValues) => {
    this.props.store.updateStatusModal({loading: true})

    const { status, applicationId } = this.props.store.statusModal
    var comment = submittedValues.comment && submittedValues.comment.trim()
    if (status && comment) {
      const data = {
        status: status,
        comment: comment,
        applicationId: applicationId
      }

      this.props.store.handleCreateStatusUpdate(data)
    }
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
    const { listing, applications, statusModal } = store

    return (
      <div>
        <LeaseUpApplicationsTable
          dataSet={this.rowsData(applications)}
          listingId={listing.id}
          onLeaseUpStatusChange={this.leaseUpStatusChangeHandler}
          onCellClick={this.goToSupplementaryInfo}
          loading={store.loading}
          onFetchData={store.handleOnFetchData}
          pages={store.pages}
          rowsPerPage={store.rowsPerPage}
        />
        <StatusModalWrapper
          {...statusModal}
          header='Update Status'
          submitButton='Update'
          onStatusChange={this.setStatusModalStatus}
          onSubmit={this.createStatusUpdate}
          onClose={this.closeStatusModal}
          onAlertCloseClick={this.hideStatusModalAlert} />
      </div>
    )
  }
}

export default withContext(LeaseUpTableContainer)
