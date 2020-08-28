import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import LeaseUpSidebarButtons from './LeaseUpSidebarButtons'
import StatusItems from './StatusItems'

import StatusItemShape from '../../utils/shapes/StatusItemShape'

const MAX_UPDATES_TO_SHOW_DEFAULT = 4

const getMostRecentStatus = (statusHistory) =>
  statusHistory && statusHistory[0]
    ? statusHistory[0].status
    : null

const ShowOrHideStatusesButton = ({ showingAllStatuses, onClick }) => {
  const buttonClasses = classNames(
    'button-link',
    't-tiny',
    'show-all-updates-toggle'
  )

  const onClickPreventDefault = (event) => {
    onClick()
    event.preventDefault()
  }

  return (
    <button className={buttonClasses} onClick={onClickPreventDefault}>
      {showingAllStatuses ? 'Show only recent status updates' : 'Show all status updates'}
    </button>
  )
}

const LeaseUpSidebar = ({ isLoading, statusItems, onSaveClicked, onChangeStatus, onAddCommentClicked }) => {
  const [showingAllStatuses, setShowingAllStatuses] = useState(false)

  const currentStatus = getMostRecentStatus(statusItems)

  const sidebarButtons = (withMobileStyling) => (
    <div className={withMobileStyling ? 'hide-large-up' : 'show-large-up'}>
      <LeaseUpSidebarButtons
        isLoading={isLoading}
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
  isLoading: PropTypes.bool,
  statusItems: PropTypes.arrayOf(PropTypes.shape(StatusItemShape)),
  onSaveClicked: PropTypes.func,
  onChangeStatus: PropTypes.func,
  onAddCommentClicked: PropTypes.func
}

LeaseUpSidebar.defaultProps = {
  isLoading: false,
  statusItems: [],
  onSaveClicked: null,
  onChangeStatus: null,
  onAddCommentClicked: null
}

export default LeaseUpSidebar
