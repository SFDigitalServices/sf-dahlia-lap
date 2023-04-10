import React from 'react'

import PropTypes from 'prop-types'

import StatusItem from './StatusItem'
import StatusItemShape from '../../../utils/shapes/StatusItemShape'

/**
 * Displays a list of status updates for the Lease-up sidebar.
 *
 * Only displays up to {limit} updates
 *
 * Note that the statusItems prop won't be sorted by this component,
 * the items should be sorted before they're passed in for performance reasons.
 */
const StatusItems = ({ statusItems, limit, height }) => {
  const limitedItems = statusItems.slice(0, limit)

  const itemBoxStyles = height ? { height: height, overflow: 'scroll' } : {}

  return (
    <div className='status-items' style={itemBoxStyles}>
      {limitedItems.map((item, idx) => (
        <StatusItem key={idx} statusItem={item} />
      ))}
    </div>
  )
}

StatusItems.propTypes = {
  limit: PropTypes.number,
  statusItems: PropTypes.arrayOf(PropTypes.shape(StatusItemShape)),
  height: PropTypes.string
}

StatusItems.defaultProps = {
  limit: Number.MAX_VALUE,
  statusItems: [],
  height: null
}

export default StatusItems
