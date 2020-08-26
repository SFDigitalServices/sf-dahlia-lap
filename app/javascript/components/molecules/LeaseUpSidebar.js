import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import LeaseUpSidebarButtons from './LeaseUpSidebarButtons'
import StatusItems from './StatusItems'

import StatusItemShape from '../../utils/shapes/StatusItemShape'
import { LEASE_UP_STATUS_VALUES } from '../../utils/statusUtils'

const MAX_UPDATES_TO_SHOW_DEFAULT = 4

const ShowOrHideStatusesButton = ({ showingAllStatuses, onClick }) => {
  const buttonClasses = classNames(
    'show-large-up',
    'button-link',
    't-tiny',
    'show-all-updates-toggle'
  )

  return (
    <button className={buttonClasses} onClick={onClick}>
      {showingAllStatuses ? 'Show only recent status updates' : 'Show all status updates'}
    </button>
  )
}

const LeaseUpSidebar = ({ currentStatus, statusItems, onSaveClicked, onChangeStatus, onAddCommentClicked }) => {
  const [showingAllStatuses, setShowingAllStatuses] = useState(false)

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

  const onShowHideStatusesToggled = () => setShowingAllStatuses(!showingAllStatuses)

  const numberOfStatusesToDisplay = showingAllStatuses ? statusItems.length : MAX_UPDATES_TO_SHOW_DEFAULT

  return (
    <div className='sidebar-content'>
      {sidebarButtons(false)}
      <h3 className='status-history-label'>Status History</h3>
      <StatusItems
        statusItems={statusItems}
        limit={numberOfStatusesToDisplay}
      />
      {statusItems.length > MAX_UPDATES_TO_SHOW_DEFAULT && (
        <ShowOrHideStatusesButton
          showingAllStatuses={showingAllStatuses}
          onClick={onShowHideStatusesToggled}
        />
      )}
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
