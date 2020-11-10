import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import {
  LEASE_UP_STATUS_VALUES,
  getStatusPillClass,
  getStatusPillLabel
} from '../../utils/statusUtils'

const StatusPill = ({ status }) => (
  <div className={classNames('status-pill', getStatusPillClass(status))}>
    {getStatusPillLabel(status)}
  </div>
)

StatusPill.propTypes = {
  status: PropTypes.oneOf(LEASE_UP_STATUS_VALUES)
}

StatusPill.defaultProps = {
  status: null
}

export default StatusPill
