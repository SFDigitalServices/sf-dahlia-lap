import React from 'react'
import { set, clone } from 'lodash'

import PrettyTime from '../atoms/PrettyTime'
import Dropdown from '../molecules/Dropdown'
import StatusModalWrapper from '../lease_ups/StatusModalWrapper'
import apiService from '~/apiService'
import { LEASE_UP_STATUS_OPTIONS, getLeaseUpStatusStyle } from '../lease_ups/leaseUpsHelpers'

class StatusUpdate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      statusModal: {
        isOpen: false,
        status: null,
        showAlert: null,
        loading: true
      }
    }
  }

  updateStatusModal = (path, value) => {
    this.setState(prevState => {
      return {
        statusModal: set(clone(prevState.statusModal), path, value)
      }
    })
  }

  openStatusModal = () => this.updateStatusModal('isOpen', true)

  closeStatusModal = () => {
    this.updateStatusModal('isOpen', false)
    this.hideStatusModalAlert()
  }

  setStatusModalStatus = (value) => this.updateStatusModal('status', value)

  setStatusModalLoading = (loading) => this.updateStatusModal('loading', loading)

  showStatusModalAlert = () => this.updateStatusModal('showAlert', true)

  hideStatusModalAlert = () => this.updateStatusModal('showAlert', false)

  statusChangeHandler = (applicationId, status) => {
    this.setStatusModalStatus(status)
    this.openStatusModal()
  }

  createStatusUpdate = async (submittedValues) => {
    this.setStatusModalLoading(true)

    const { status } = this.state.statusModal
    var comment = submittedValues.comment && submittedValues.comment.trim()

    if (status && comment) {
      const data = {
        status: status,
        comment: comment,
        applicationId: this.props.applicationId
      }

      const response = await apiService.createLeaseUpStatus(data)

      if (response) {
        this.setStatusModalLoading(false)
        this.setStatusModalStatus(null)
        this.hideStatusModalAlert()
        this.closeStatusModal()
      } else {
        this.setStatusModalLoading(false)
        this.showStatusModalAlert()
      }
    }
  }

  render () {
    const { currentStatus, comment, date } = this.props

    return (
      <div className='status-update'>
        <h3 className='status-update_title'>Update Status</h3>
        <div className='status-update_action'>
          <Dropdown
            items={LEASE_UP_STATUS_OPTIONS}
            value={currentStatus}
            prompt='Status'
            onChange={this.statusChangeHandler}
            styles={{position: 'relative'}}
            buttonClasses={['small', getLeaseUpStatusStyle(currentStatus)]} />
        </div>
        <div className='status-update_message'>
          <div className='status-update_comment'>
            <p className='status-update_note'>{comment}</p>
            <span className='status-update_date'>
              <PrettyTime time={date} displayType='short' />
            </span>
          </div>
          <div className='status-update_footer'>
            <button className='button tiny tertiary' type='button' onClick={this.statusChangeHandler}>
              Add a comment
            </button>
            <a href='#' className='t-small right'>See Status History</a>
          </div>
        </div>
        <StatusModalWrapper
          isOpen={this.state.statusModal.isOpen}
          status={this.state.statusModal.status}
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

export default StatusUpdate
