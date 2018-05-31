import React from 'react'
import _ from 'lodash'

import StatusList from './StatusList'
import ContentSection from '../molecules/ContentSection'

const StatusUpdateSection = () => (
  <div className="app-inner inset-wide padding-bottom-none margin-top">
    <h2 className="sr-only">Status Update</h2>
    <div className="status-update expand-wide is-processing">
      <h3 className="status-update_title">Update Status</h3>
      <div className="status-update_action">
        <button className="button dropdown-button has-icon--right text-align-left small is-processing" href="#" aria-expanded="false">
          <span className="ui-icon ui-small" aria-hidden="true">
            <svg>
              <use xlinkHref="#i-arrow-down"></use>
            </svg>
          </span>
          Processing
        </button>
      </div>
      <div className="status-update_message">
        <div className="status-update_comment">
          <p className="status-update_note">Some comment</p>
          <span className="status-update_date">03/12/18 </span>
        </div>
        <div className="status-update_footer">
          <button className="button tiny tertiary" type="button" data-event="">Add a comment</button>
          <a href="/see_status_history" className="t-small right">See Status History</a>
        </div>
      </div>
    </div>
  </div>
)

const StatusHistorySection = ({statusHistory}) => (
  <ContentSection title="Lease Information">
    <ContentSection.Sub title="Status History">
        <StatusList items={statusHistory} onAddCommnent={()=>alert('add comment')}/>
    </ContentSection.Sub>
  </ContentSection>
)

const SupplementalApplicationContainer = ({statusHistory}) => {
  return (
    <React.Fragment>
      <StatusUpdateSection/>
      <ContentSection title="Current Contact Information"/>
      {!_.isEmpty(statusHistory) && <StatusHistorySection statusHistory={statusHistory} />}
    </React.Fragment>
  )
}

export default SupplementalApplicationContainer
