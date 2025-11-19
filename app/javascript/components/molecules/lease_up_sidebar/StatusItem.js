import React from 'react'

import moment from 'moment'
import PropTypes from 'prop-types'

import StatusItemShape from '../../../utils/shapes/StatusItemShape'
import { getSubStatusLabel } from '../../../utils/statusUtils'
import StatusPill from '../../atoms/StatusPill'

const StatusDate = ({ timestamp }) => (
  <div className='status-item-date'>{moment.unix(timestamp).format('MMM D, YYYY h:mm a')}</div>
)
const StatusCreatedBy = ({ createdBy }) => <div className='status-item-created-by'>{createdBy}</div>

StatusDate.propTypes = { timestamp: PropTypes.number }

const StatusItem = ({ statusItem }) => {
  const { status, substatus, comment, timestamp, created_by } = statusItem

  const substatusLabel = getSubStatusLabel(status, substatus)

  return (
    <div className='status-item' data-testid='status-item'>
      {status && (
        <div className='status-item-header'>
          <StatusPill status={status} />
        </div>
      )}
      {substatusLabel && <div className='item-substatus-text'>{substatusLabel}</div>}
      <div className='status-item-text'>{comment}</div>
      <div className='status-item-footer'>
        <StatusCreatedBy createdBy={created_by} />
        <StatusDate timestamp={timestamp} />
      </div>
    </div>
  )
}

StatusItem.propTypes = {
  statusItem: PropTypes.shape(StatusItemShape).isRequired
}

export default StatusItem
