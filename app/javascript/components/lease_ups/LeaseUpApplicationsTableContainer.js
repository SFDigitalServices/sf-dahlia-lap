import React from 'react'
import { set, clone, trim, map, each, cloneDeep } from 'lodash'
import moment from 'moment'

import apiService from '~/apiService'
import LeaseUpApplicationsTable from './LeaseUpApplicationsTable'
import StatusModalWrapper from '~/components/organisms/StatusModalWrapper'
import utils from '~/utils/utils'
import appPaths from '~/utils/appPaths'
import { withContext } from './context'

class LeaseUpTableContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      statusModal: {
        isOpen: false,
        status: null,
        applicationId: null,
        showAlert: null,
        loading: false
      },
      applications: this.props.applications
    }
    console.log('setting state', this.props.store.applications)
  }

  updateStatusModal = (values) => {
    this.setState(prevState => {
      return {
        statusModal: {
          ...clone(prevState.statusModal),
          ...values
        }
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

  closeStatusModal = () => {
    this.updateStatusModal({
      isOpen: false,
      showAlert: false
    })
  }

  setStatusModalStatus = (value) => this.updateStatusModal({status: value})

  hideStatusModalAlert = () => this.updateStatusModal('showAlert', false)

  leaseUpStatusChangeHandler = (applicationPreferenceId, applicationId, status) => {
    this.updateStatusModal({
      applicationId: applicationId,
      applicationPreferenceId: applicationPreferenceId,
      isOpen: true,
      status: status
    })
  }

  createStatusUpdate = async (submittedValues) => {
    this.updateStatusModal({loading: true})

    const { status, applicationId } = this.state.statusModal
    var comment = submittedValues.comment && submittedValues.comment.trim()
    if (status && comment) {
      const data = {
        status: status,
        comment: comment,
        applicationId: applicationId
      }

      // TODO:  This apiService call should be moved out to the LeaseUpApplicationPage.
      //        We should pass a handler that wraps this API call.
      const response = await apiService.createFieldUpdateComment(data)

      if (response) {
        // find the rows with the application id whose status is being updated
        // and update their lease up status value and status updated date
        // in the table
        each(this.state.applications, (app, index) => {
          if (app.application_id === applicationId) {
            this.updateResults(`[${index}]['lease_up_status']`, status)
            this.updateResults(`[${index}]['status_updated']`, moment().format(utils.SALESFORCE_DATE_FORMAT))
          }
        })

        this.updateStatusModal({
          applicationId: null,
          isOpen: false,
          loading: false,
          showAlert: false,
          status: null
        })
      } else {
        this.updateStatusModal({
          loading: false,
          showAlert: true
        })
      }
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
    // console.log('rendering component', this.props.store.applications)
    const { store } = this.props
    const { listing, applications } = store
    const { statusModal } = this.state

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
