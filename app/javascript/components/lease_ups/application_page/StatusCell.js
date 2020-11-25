import React from 'react'

import { PropTypes } from 'prop-types'

import StatusDropdown from 'components/molecules/StatusDropdown'
import StatusHistoryPopover from 'components/organisms/StatusHistoryPopover'
import { LEASE_UP_STATUS_VALUES } from 'utils/statusUtils'

export const VALIDATION_CONFIRMED = 'Confirmed'
export const VALIDATION_UNCONFIRMED = 'Unconfirmed'
export const VALIDATION_INVALID = 'Invalid'

const cellContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: '100%'
}

const StatusCell = ({ applicationId, status = null, onChange = (_) => {} }) => {
  return (
    <div style={cellContainerStyle}>
      <StatusDropdown status={status} size='tiny' onChange={onChange} />
      <StatusHistoryPopover applicationId={applicationId} customButtonClasses='margin-left' />
    </div>
  )
}

StatusCell.propTypes = {
  applicationId: PropTypes.string.isRequired,
  status: PropTypes.oneOf(LEASE_UP_STATUS_VALUES),
  onChange: PropTypes.func
}

export default StatusCell
