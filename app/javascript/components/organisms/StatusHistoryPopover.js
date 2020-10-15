import React, { useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import Icon from '~/components/atoms/Icon'
import Popover from '~/components/molecules/Popover'
import StatusItems from '~/components/molecules/lease_up_sidebar/StatusItems'
import StatusItemShape from '~/utils/shapes/StatusItemShape'

const MAX_UPDATES_TO_SHOW_DEFAULT = 4
const StatusHistoryPopover = ({ statusItems }) => {
  const [showingAllStatuses, setShowingAllStatuses] = useState(false)
  const onShowHideStatusesToggled = () => setShowingAllStatuses(!showingAllStatuses)

  const numberOfStatusesToDisplay = showingAllStatuses
    ? statusItems.length
    : MAX_UPDATES_TO_SHOW_DEFAULT

  const StatusIconButton = ({ onClick, ref }) => (
    <button ref={ref} onClick={onClick} className='tiny icon margin-left--half'>
      <Icon icon='arrow-down' size='small' />
    </button>
  )

  return (
    <Popover buttonElement={StatusIconButton}>
      <StatusItems statusItems={statusItems} limit={numberOfStatusesToDisplay} height='20rem' />
      {statusItems.length > MAX_UPDATES_TO_SHOW_DEFAULT && (
        <button
          className={classNames('button-link', 't-tiny')}
          type='button'
          onClick={onShowHideStatusesToggled}
        >
          {showingAllStatuses ? 'Show only recent status updates' : 'Show all status updates'}
        </button>
      )}
    </Popover>
  )
}
StatusHistoryPopover.propTypes = {
  statusItems: PropTypes.arrayOf(PropTypes.shape(StatusItemShape)).isRequired
}

export default StatusHistoryPopover
