import React from 'react'
import PropTypes from 'prop-types'

import { LEASE_UP_STATUS_VALUES, getStatusPillClass, getStatusPillLabel } from '../../utils/statusUtils'

const StatusPill = ({ status }) => (
  <div className={getStatusPillClass(status)}>
    <div className='pill-text'>{getStatusPillLabel(status)}</div>
  </div>
)

StatusPill.propTypes = {
  status: PropTypes.oneOf(LEASE_UP_STATUS_VALUES)
}

StatusPill.defaultProps = {
  status: null
}

export default StatusPill
