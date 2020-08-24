import React from 'react'

import { getStatusPillClass, getStatusPillLabel } from '../../utils/statusUtils'

const StatusPill = ({ status }) => (
  <div className={getStatusPillClass(status)}>
    <div className='pill-text'>{getStatusPillLabel(status)}</div>
  </div>
)

export default StatusPill
