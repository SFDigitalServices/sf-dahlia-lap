import React from 'react'
import moment from 'moment'

import StatusPill from '../atoms/StatusPill'

import { getSubStatusLabel } from '../../utils/statusUtils'

const StatusDate = ({ timeStamp }) => (
  <div class='status-item-date'>
    {moment(timeStamp).format('MMMM Do YYYY')}
  </div>
)

const StatusItem = ({ item }) => {
  const { status, subStatus, comment, timeStamp } = item

  const subStatusLabel = getSubStatusLabel(status, subStatus)

  return (
    <div class='status-items'>
      <div class='status-item'>
        <div class='status-item-header'>
          <StatusPill status={status} />
          <StatusDate timeStamp={timeStamp} />
        </div>
        {subStatusLabel && (
          <div class='item-substatus-text'>
            {subStatusLabel}
          </div>
        )}
        <div class='status-item-text'>
          {comment}
        </div>
      </div>
    </div>
  )
}

const StatusItems = ({ statusItems }) => (
  <div class='status-items'>
    {statusItems.map((item, idx) => <StatusItem key={idx} item={item} />)}
  </div>
)

export default StatusItems
