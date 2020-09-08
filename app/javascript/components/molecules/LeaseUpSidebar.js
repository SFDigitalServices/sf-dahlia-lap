import React, { useState } from 'react'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import LeaseUpSidebarButtons from './LeaseUpSidebarButtons'
import StatusItems from './StatusItems'

import StatusItemShape from '../../utils/shapes/StatusItemShape'
import ContentSection from './ContentSection'

const MAX_UPDATES_TO_SHOW_DEFAULT = 4

const getMostRecentStatus = (statusHistory) =>
  statusHistory && statusHistory[0]
    ? statusHistory[0].status
    : null

// visible for testing
export const ShowOrHideStatusesButton = ({ showingAllStatuses, onClick }) => {
  const buttonClasses = classNames(
    'button-link',
    't-tiny',
    'show-all-updates-toggle'
  )

  return (
    <button
      className={buttonClasses}
      type='button'
      onClick={onClick}
    >
      {showingAllStatuses ? 'Show only recent status updates' : 'Show all status updates'}
    </button>
  )
}

const LeaseUpSidebar = ({ isLoading, statusItems, onSaveClicked, onChangeStatus, onAddCommentClicked }) => {
  const [showingAllStatuses, setShowingAllStatuses] = useState(false)

  const currentStatus = getMostRecentStatus(statusItems)
  const onShowHideStatusesToggled = () => setShowingAllStatuses(!showingAllStatuses)
  const numberOfStatusesToDisplay = showingAllStatuses ? statusItems.length : MAX_UPDATES_TO_SHOW_DEFAULT

  const renderSidebarButtons = (withMobileStyling) => (
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

  const renderStatusItemsSection = () => (
    <>
      <div className='padding-top--3x show-large-up'>
        <ContentSection.SubHeader title='Status History' />
      </div>
      <div className='padding-top--half hide-large-up'>
        <ContentSection.Header title='Status History' />
      </div>
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
    </>
  )

  return (
    <div className='sidebar-content'>
      {renderSidebarButtons(false)}
      {!isEmpty(statusItems) && renderStatusItemsSection()}
      {renderSidebarButtons(true)}
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
