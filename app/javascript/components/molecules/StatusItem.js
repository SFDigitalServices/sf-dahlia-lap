import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import StatusPill from '../atoms/StatusPill'

import StatusItemShape from '../../utils/shapes/StatusItemShape'
import { getSubStatusLabel } from '../../utils/statusUtils'

const StatusDate = ({ timestamp }) => (
  <div className='status-item-date'>
    {moment.unix(timestamp).format('MMM D, YYYY')}
  </div>
)

StatusDate.propTypes = { timestamp: PropTypes.number }

const StatusItem = ({ statusItem }) => {
  const { status, substatus, comment, timestamp } = statusItem

  const substatusLabel = getSubStatusLabel(status, substatus)

  return (
    <div className='status-item'>
      <div className='status-item-header'>
        <StatusPill status={status} />
        <StatusDate timestamp={timestamp} />
      </div>
      {substatusLabel && (
        <div className='item-substatus-text'>
          {substatusLabel}
        </div>
      )}
      <div className='status-item-text'>
        {comment}
      </div>
    </div>
  )
}

StatusItem.propTypes = {
  statusItem: PropTypes.shape(StatusItemShape).isRequired
}

export default StatusItem
