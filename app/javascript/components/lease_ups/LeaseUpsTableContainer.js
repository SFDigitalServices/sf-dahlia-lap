import React from 'react'
import { set, cloneDeep, trim, findIndex, map } from 'lodash'
import moment from 'moment'

import apiService from '~/apiService'
import LeaseUpsTable from './LeaseUpsTable'
import LeaseUpsStatusModalWrapper from './LeaseUpsStatusModalWrapper'
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
      results: this.props.results
    }
  }

  updateState = (path, value) => {
    this.setState(prevState => {
      var newState = cloneDeep(prevState)
      set(newState, path, value)
      return newState
    })
  }

  openStatusModal = () => this.updateState('statusModal.isOpen', true)

  closeStatusModal = () => this.updateState('statusModal.isOpen', false)

  setStatusModalStatus = (value) => this.updateState('statusModal.status', value)

  setStatusModalAppId = (value) => this.updateState('statusModal.applicationId', value)

  setStatusModalLoading = (loading) => this.updateState('statusModal.loading', loading)

  showStatusModalAlert = () => this.updateState('statusModal.showAlert', true)

  hideStatusModalAlert = () => this.updateState('statusModal.showAlert', false)

  leaseUpStatusChangeHandler = (applicationId, status) => {
    this.setStatusModalStatus(status)
    this.setStatusModalAppId(applicationId)
    this.openStatusModal()
  }

  createStatusUpdate = async (submittedValues) => {
    this.setStatusModalLoading(true)

    var status = this.state.statusModal.status
    var comment = submittedValues.comment && submittedValues.comment.trim()
    var applicationId = this.state.statusModal.applicationId

    if (status && comment) {
      var data = {
        status: status,
        comment: comment,
        applicationId: applicationId
      }

      var response = await apiService.createLeaseUpStatus(data)

      if (response) {
        // find the application in question in the applications table data
        // and update its lease up status value and status updated date
        // in the table
        var applicationIndex = findIndex(this.state.results, {Application: applicationId})
        this.updateState(`results[${applicationIndex}]['Application.Processing_Status']`, status)
        this.updateState(`results[${applicationIndex}]['Status_Last_Updated']`, moment().format("D MMM YY"))

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
    // if we are going to use Mobx this mapping logic could be extracted to a Model
    let rowData = {
      id:                 result['Application'],
      application_number: result['Application.Name'],
      first_name:         result['Application.First_Name'],
      last_name:          result['Application.Last_Name'],
      phone:              result['Application.Phone'],
      email:              result['Application.Email'],
      status_updated:     result['Status_Last_Updated'],
      lease_up_status:    result['Application.Processing_Status'],
      preference_order:   result["Preference_Order"],
    }

    if (!!trim(result['Application.Mailing_Address'])) {
      rowData.address = result['Application.Mailing_Address']
    } else {
      rowData.address = result['Application.Residence_Address']
    }

    rowData.preference_rank = `${result['Listing_Preference_ID.Record_Type_For_App_Preferences']} ${result['Preference_Lottery_Rank']}`
    rowData.rankOrder = parseInt(`${result['Preference_Order']}${result['Preference_Lottery_Rank']}`, 10)

    return rowData
  }

  goToSupplementaryInfo = (listingId, rowInfo) => {
    window.location.href = appPaths.toApplicationSupplementals(rowInfo.original.id)
  }

  rowsData() {
    return map(this.state.results, result => this.buildRowData(result))
  }

  render() {
    const { listing } = this.props

    return (
      <div>
        <LeaseUpsTable
            dataSet={this.rowsData()}
            listingId={listing.Id}
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
