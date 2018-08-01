import React from 'react'
import { set, clone, trim, findIndex, map, cloneDeep } from 'lodash'
import moment from 'moment'

import apiService from '~/apiService'
import LeaseUpsTable from './LeaseUpsTable'
import LeaseUpsStatusModalWrapper from './LeaseUpsStatusModalWrapper'
import utils from '~/utils/utils'
import appPaths from '~/utils/appPaths'

class LeaseUpTableContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      statusModal: {
        isOpen: false,
        status: null,
        applicationId: null,
        showAlert: null,
        loading: false,
      },
      applications: this.props.applications
    }
  }

  updateStatusModal = (path, value) => {
    this.setState(prevState => {
      return {
        statusModal: set(clone(prevState.statusModal), path, value)
      }
    })
  }

  updateResults = (path, value) => {
    this.setState(prevState => {
      return {
        applications: set(clone(prevState.applications), path, value)
      }
    })
  }

  openStatusModal = () => this.updateStatusModal('isOpen', true)

  closeStatusModal = () => {
    this.updateStatusModal('isOpen', false)
    this.hideStatusModalAlert()
  }

  setStatusModalStatus = (value) => this.updateStatusModal('status', value)

  setStatusModalApplicationPreferenceId = (value) => this.updateStatusModal('applicationPreferenceId', value)

  setStatusModalAppId = (value) => this.updateStatusModal('applicationId', value)

  setStatusModalLoading = (loading) => this.updateStatusModal('loading', loading)

  showStatusModalAlert = () => this.updateStatusModal('showAlert', true)

  hideStatusModalAlert = () => this.updateStatusModal('showAlert', false)

  leaseUpStatusChangeHandler = (applicationPreferenceId, applicationId, status) => {
    this.setStatusModalStatus(status)
    this.setStatusModalApplicationPreferenceId(applicationPreferenceId)
    this.setStatusModalAppId(applicationId)
    this.openStatusModal()
  }

  createStatusUpdate = async (submittedValues) => {
    this.setStatusModalLoading(true)

    const { status, applicationId, applicationPreferenceId } = this.state.statusModal
    var comment = submittedValues.comment && submittedValues.comment.trim()

    if (status && comment) {
      const data = {
        status: status,
        comment: comment,
        applicationId: applicationId
      }

      const response = await apiService.createLeaseUpStatus(data)

      if (response) {
        // find the application in question in the applications table data
        // and update its lease up status value and status updated date
        // in the table
        const applicationIndex = findIndex(this.state.applications, { id: applicationPreferenceId })

        this.updateResults(`[${applicationIndex}]['lease_up_status']`, status)
        this.updateResults(`[${applicationIndex}]['status_updated']`, moment().format(utils.SALESFORCE_DATE_FORMAT))

        this.setStatusModalLoading(false)
        this.setStatusModalStatus(null)
        this.setStatusModalAppId(null)
        this.hideStatusModalAlert(null)
        this.closeStatusModal()
      } else {
        this.setStatusModalLoading(false)
        this.showStatusModalAlert()
      }
    }
  }

  buildRowData(result) {
    let rowData = cloneDeep(result)

    if (!!trim(result.mailing_address)) {
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
    window.location.href = appPaths.toApplicationSupplementals(rowInfo.original.id)
  }

  rowsData() {
    return map(this.state.applications, result => this.buildRowData(result))
  }

  render() {
    const { listing } = this.props

    return (
      <div>
        <LeaseUpsTable
            dataSet={this.rowsData()}
            listingId={listing.id}
            onLeaseUpStatusChange={this.leaseUpStatusChangeHandler}
            onCellClick={this.goToSupplementaryInfo} />
        <LeaseUpsStatusModalWrapper
            isOpen={this.state.statusModal.isOpen}
            status={this.state.statusModal.status}
            applicationId={this.state.statusModal.applicationId}
            changeHandler={this.setStatusModalStatus}
            submitHandler={this.createStatusUpdate}
            closeHandler={this.closeStatusModal}
            showAlert={this.state.statusModal.showAlert}
            onAlertCloseClick={this.hideStatusModalAlert}
            loading={this.state.statusModal.loading} />
      </div>
    )
  }
}

export default LeaseUpTableContainer
