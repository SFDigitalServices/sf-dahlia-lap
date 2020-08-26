import React from 'react'
import PropTypes from 'prop-types'

import LeaseUpSidebarButtons from './LeaseUpSidebarButtons'
import StatusItems from './StatusItems'

import StatusItemShape from '../../utils/shapes/StatusItemShape'
import { LEASE_UP_STATUS_VALUES } from '../../utils/statusUtils'

const LeaseUpSidebar = ({ currentStatus, statusItems, onSaveClicked, onChangeStatus, onAddCommentClicked }) => {
  const sidebarButtons = (withMobileStyling) => (
    <div className={withMobileStyling ? 'hide-large-up' : 'show-large-up'}>
      <LeaseUpSidebarButtons
        status={currentStatus}
        withMobileStyling={withMobileStyling}
        onSaveClicked={onSaveClicked}
        onChangeStatus={onChangeStatus}
        onAddCommentClicked={onAddCommentClicked}
      />
    </div>
  )

  return (
    <div className='sidebar-content'>
      {sidebarButtons(false)}
      <h3 className='status-history-label'>Status History</h3>
      <StatusItems statusItems={statusItems} />
      {sidebarButtons(true)}
    </div>
  )
}

LeaseUpSidebar.propTypes = {
  currentStatus: PropTypes.oneOf(LEASE_UP_STATUS_VALUES).isRequired,
  statusItems: PropTypes.arrayOf(PropTypes.shape(StatusItemShape)),
  onSaveClicked: PropTypes.func,
  onChangeStatus: PropTypes.func,
  onAddCommentClicked: PropTypes.func
}

LeaseUpSidebar.defaultProps = {
  statusItems: [],
  onSaveClicked: null,
  onChangeStatus: null,
  onAddCommentClicked: null
}

export default LeaseUpSidebar
