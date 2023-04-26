import React, { useState } from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import StatusItems from './StatusItems'
import StatusItemShape from '../../../utils/shapes/StatusItemShape'
import ContentSection from '../ContentSection'

const MAX_UPDATES_TO_SHOW_DEFAULT = 4

/**
 * Displays a list of status items in a container with a header and
 * a show/hide entire status item list link.
 *
 * Defaults to only showing 4 status items at a time.
 */
const StatusHistoryContainer = ({ statusItems }) => {
  const [showingAllStatuses, setShowingAllStatuses] = useState(false)

  const onShowHideStatusesToggled = () => setShowingAllStatuses(!showingAllStatuses)

  const numberOfStatusesToDisplay = showingAllStatuses
    ? statusItems.length
    : MAX_UPDATES_TO_SHOW_DEFAULT

  return (
    <>
      <div className='padding-top--3x show-large-up'>
        <ContentSection.SubHeader title='Status History' />
      </div>
      <div className='padding-top--half hide-large-up'>
        <ContentSection.Header title='Status History' />
      </div>
      <StatusItems statusItems={statusItems} limit={numberOfStatusesToDisplay} />
      {statusItems.length > MAX_UPDATES_TO_SHOW_DEFAULT && (
        <button
          className={classNames('button-link', 't-tiny', 'show-all-updates-toggle')}
          type='button'
          onClick={onShowHideStatusesToggled}
        >
          {showingAllStatuses ? 'Show only recent status updates' : 'Show all status updates'}
        </button>
      )}
    </>
  )
}

StatusHistoryContainer.propTypes = {
  statusItems: PropTypes.arrayOf(PropTypes.shape(StatusItemShape)).isRequired
}

export default StatusHistoryContainer
