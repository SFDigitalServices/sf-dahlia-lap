import React from 'react'
import _ from 'lodash'

import apiService from '~/apiService'
import LeaseUpsTable from './LeaseUpsTable'
import LeaseUpsStatusModalWrapper from './LeaseUpsStatusModalWrapper'

class LeaseUpTableContainer extends React.Component {
  state = {
    statusModal: {
      isOpen: false,
      status: null,
      applicationId: null,
    }
  }

  openStatusModal  = () => {
    this.setState(prevState => ({statusModal: {...prevState.statusModal, isOpen: true}}))
  }

  closeStatusModal = () => {
    this.setState(prevState => ({statusModal: {...prevState.statusModal, isOpen: false}}))
  }

  setStatusModalStatus = (value) => {
    this.setState(prevState => ({statusModal: {...prevState.statusModal, status: value}}))
  }

  setStatusModalAppId = (value) => {
    this.setState(prevState => ({statusModal: {...prevState.statusModal, applicationId: value}}))
  }

  leaseUpStatusChangeHandler = (applicationId, status) => {
    this.setStatusModalStatus(status)
    this.setStatusModalAppId(applicationId)
    this.openStatusModal()
  }

  createStatusUpdate = async (submittedValues) => {
    var status = this.state.statusModal.status
    var comment = submittedValues.comment && submittedValues.comment.trim()

    if (status && comment) {
      var data = {
        status: status,
        comment: comment,
        applicationId: this.state.statusModal.applicationId
      }

      var response = await apiService.createLeaseUpStatus(data)

      if (response) {
        this.setStatusModalStatus(null)
        this.setStatusModalAppId(null)
        this.closeStatusModal()
      } else {
        // this is a quick error handling approach - product may want to
        // provide guidance on exact handling desired in this case
        alert('There was an error processing your status update. Please try again.')
      }
      // MAY HAPPEN HERE OR MAY NEED TO HAPPEN ELSEWHERE:
      // ensure that the final selected status in the modal gets propagated
      // to the status button in the correct row in the applications table
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
      status_updated:     result['LastModifiedDate'],
      lease_up_status:    result['Application.Processing_Status'],
      preference_order:   result["Preference_Order"],
    }

    if (!!_.trim(result['Application.Mailing_Address'])) {
      rowData.address = result['Application.Mailing_Address']
    } else {
      rowData.address = result['Application.Residence_Address']
    }

    rowData.preference_rank = `${result['Listing_Preference_ID.Record_Type_For_App_Preferences']} ${result['Preference_Lottery_Rank']}`
    rowData.rankOrder = parseInt(`${result['Preference_Order']}${result['Preference_Lottery_Rank']}`, 10)

    return rowData
  }

  goToSupplementaryInfo = (listingId, rowInfo) => {
    window.location.href = `/listing/${listingId}/lease_ups/${rowInfo.original.id}`
  }

  rowsData() {
   return _.map(this.props.results, result => this.buildRowData(result))
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
            closeHandler={this.closeStatusModal} />
      </div>
    )
  }
}

export default LeaseUpTableContainer
