import React from 'react'

import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'

import StatusItemShape from '../../../utils/shapes/StatusItemShape'
import LeaseUpStatusButtons from './LeaseUpStatusButtons'
import StatusHistoryContainer from './StatusHistoryContainer'

const getMostRecentStatus = (statusHistory) =>
  statusHistory && statusHistory[0] ? statusHistory[0].status : null

const LeaseUpSidebar = ({
  isLoading,
  statusItems,
  onSaveClicked,
  onChangeStatus,
  onAddCommentClicked
}) => {
  const currentStatus = getMostRecentStatus(statusItems)

  const saveButton = (
    <button
      className='primary save-button'
      id='save-supplemental-application'
      type='submit'
      disabled={isLoading}
      onClick={onSaveClicked}
    >
      {isLoading ? 'Saving…' : 'Save'}
    </button>
  )

  const statusButtons = (
    <LeaseUpStatusButtons
      isLoading={isLoading}
      status={currentStatus}
      onChangeStatus={onChangeStatus}
      onAddCommentClicked={onAddCommentClicked}
    />
  )

  return (
    <div className='sidebar-content'>
      <div className={'show-large-up'}>
        {saveButton}
        {statusButtons}
      </div>
      {!isEmpty(statusItems) && <StatusHistoryContainer statusItems={statusItems} />}
      <div className={'hide-large-up'}>
        {statusButtons}
        {saveButton}
      </div>
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
