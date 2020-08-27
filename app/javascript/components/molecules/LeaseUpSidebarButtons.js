import React from 'react'
import PropTypes from 'prop-types'

import StatusDropdown from './StatusDropdown'

import { LEASE_UP_STATUS_VALUES } from '../../utils/statusUtils'

const LeaseUpSidebarButtons = ({ status, withMobileStyling, onSaveClicked, onChangeStatus, onAddCommentClicked }) => {
  const saveButton = (
    <button
      className='primary save-button'
      onClick={onSaveClicked}
    >
      Save
    </button>
  )

  const statusHistoryButtons = (
    <div className='status-history-buttons'>
      <StatusDropdown
        status={status}
        onChange={onChangeStatus}
        buttonClasses={['tight-padding']}
      />
      <button
        className='tertiary tight-padding'
        onClick={onAddCommentClicked}
      >
        Add a comment
      </button>
    </div>
  )

  return (
    <>
      {!withMobileStyling && saveButton}
      {statusHistoryButtons}
      {withMobileStyling && saveButton}
    </>
  )
}

LeaseUpSidebarButtons.propTypes = {
  status: PropTypes.oneOf(LEASE_UP_STATUS_VALUES).isRequired,
  withMobileStyling: PropTypes.bool,
  onSaveClicked: PropTypes.func,
  onChangeStatus: PropTypes.func,
  onAddCommentClicked: PropTypes.func
}

LeaseUpSidebarButtons.defaultProps = {
  withMobileStyling: false,
  onSaveClicked: null,
  onChangeStatus: null,
  onAddCommentClicked: null
}

export default LeaseUpSidebarButtons
