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
    <div className='status-items'>
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
    </div>
  )
}

StatusItem.propTypes = { statusItem: PropTypes.shape(StatusItemShape).isRequired }

/**
 * Displays a list of status updates for the Lease-up sidebar.
 *
 * Only displays up to {limit} updates
 *
 * Note that the statusItems prop won't be sorted by this component,
 * the items should be sorted before they're passed in for performance reasons.
 */
const StatusItems = ({ statusItems, limit }) => {
  const limitedItems = statusItems.slice(0, limit)

  return (
    <div className='status-items'>
      {limitedItems.map((item, idx) => (
        <StatusItem
          key={idx}
          statusItem={item}
        />
      ))}
    </div>
  )
}

StatusItems.propTypes = {
  limit: PropTypes.number,
  statusItems: PropTypes.arrayOf(PropTypes.shape(StatusItemShape))
}

StatusItems.defaultProps = {
  limit: Number.MAX_VALUE,
  statusItems: []
}

export default StatusItems
