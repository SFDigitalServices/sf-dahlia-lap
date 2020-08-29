import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import StatusPill from '../atoms/StatusPill'

import StatusItemShape from '../../utils/shapes/StatusItemShape'
import { getSubStatusLabel } from '../../utils/statusUtils'

const StatusDate = ({ timeStamp }) => (
  <div className='status-item-date'>
    {moment.unix(timeStamp).format('MMMM Do YYYY')}
  </div>
)

StatusDate.propTypes = { timeStamp: PropTypes.number }

const StatusItem = ({ statusItem }) => {
  const { status, subStatus, comment, timeStamp } = statusItem

  const subStatusLabel = getSubStatusLabel(status, subStatus)

  return (
    <div className='status-item'>
      <div className='status-item-header'>
        <StatusPill status={status} />
        <StatusDate timeStamp={timeStamp} />
      </div>
      {subStatusLabel && (
        <div className='item-substatus-text'>
          {subStatusLabel}
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
