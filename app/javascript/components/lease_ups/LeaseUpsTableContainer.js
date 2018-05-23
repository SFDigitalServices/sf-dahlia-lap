import React from 'react'
import ReactTable from 'react-table'
import _ from 'lodash'
import moment from 'moment'

import LeaseUpsTable from './LeaseUpsTable'
import appPaths from '../../utils/appPaths'

class LeaseUpTableContainer extends React.Component {

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
    rowData.rankOrder = parseInt(`${result['Preference_Order']}${result['Preference_Lottery_Rank']}`)

    return rowData
  }

  updateLeaseUpStatus = (applicationId, status) => {
    // apiService.updateLeaseUpStatus(applicationId, status)
  }

  gotToSupplementaryInfo = (listingId, rowInfo) => {
    window.location.href = appPaths.toApplicationSupplementals(rowInfo.original.id)
    // window.location.href = `/listing/${listingId}/lease_ups/${rowInfo.original.id}`
  }

  rowsData() {
   return _.map(this.props.results, result => this.buildRowData(result))
  }

  render() {
    const { listing } = this.props

    return (
        <LeaseUpsTable
            dataSet={this.rowsData()}
            listingId={listing.Id}
            onLeaseUpStatusChange={this.updateLeaseUpStatus}
            onCellClick={this.gotToSupplementaryInfo} />
    )
  }
}

export default LeaseUpTableContainer
