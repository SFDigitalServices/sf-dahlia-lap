import React from 'react'

import PropTypes from 'prop-types'

import { LEASE_UP_STATUS_VALUES } from '../../../utils/statusUtils'
import StatusDropdown from '../StatusDropdown'

const LeaseUpStatusButtons = ({ status, isLoading, onChangeStatus, onAddCommentClicked }) => (
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
      type='button'
      onClick={onAddCommentClicked}
    >
      Add a comment
    </button>
  </div>
)

LeaseUpStatusButtons.propTypes = {
  status: PropTypes.oneOf(LEASE_UP_STATUS_VALUES),
  isLoading: PropTypes.bool,
  onChangeStatus: PropTypes.func,
  onAddCommentClicked: PropTypes.func
}

LeaseUpStatusButtons.defaultProps = {
  status: null,
  isLoading: false,
  onChangeStatus: null,
  onAddCommentClicked: null
}

export default LeaseUpStatusButtons
