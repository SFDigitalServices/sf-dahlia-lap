import React from 'react'
import PropTypes from 'prop-types'

import StatusDropdown from './StatusDropdown'

import { LEASE_UP_STATUS_VALUES } from '../../utils/statusUtils'

const LeaseUpSidebarButtons = ({ status, withMobileStyling, isLoading, onSaveClicked, onChangeStatus, onAddCommentClicked }) => {
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

  const statusHistoryButtons = (
    <div className='status-history-buttons'>
      <StatusDropdown
        status={status}
        onChange={onChangeStatus}
        disabled={isLoading}
        buttonClasses={['tight-padding']}
      />
      <button
        // ID is just for e2e tests
        id='add-status-history-comment'
        className='tertiary tight-padding'
        disabled={isLoading}
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
  isLoading: PropTypes.bool,
  onSaveClicked: PropTypes.func,
  onChangeStatus: PropTypes.func,
  onAddCommentClicked: PropTypes.func
}

LeaseUpSidebarButtons.defaultProps = {
  withMobileStyling: false,
  isLoading: false,
  onSaveClicked: null,
  onChangeStatus: null,
  onAddCommentClicked: null
}

export default LeaseUpSidebarButtons
