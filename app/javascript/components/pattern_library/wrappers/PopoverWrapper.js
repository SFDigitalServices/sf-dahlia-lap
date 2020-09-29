import React, { useState } from 'react'
import classNames from 'classnames'

import Popover from '~/components/molecules/Popover'
import StatusItems from '~/components/molecules/lease_up_sidebar/StatusItems'

const MAX_UPDATES_TO_SHOW_DEFAULT = 4
const PopoverWrapper = ({ statusItems }) => {
  const [showingAllStatuses, setShowingAllStatuses] = useState(false)
  const onShowHideStatusesToggled = () =>
    setShowingAllStatuses(!showingAllStatuses)

  const numberOfStatusesToDisplay = showingAllStatuses
    ? statusItems.length
    : MAX_UPDATES_TO_SHOW_DEFAULT

  // If using a component as a button element, you will need to use React.forwardRefs()
  // to wrap the component.
  const sampleButtonElement = ({ onClick, ref }) => (
    <button ref={ref} onClick={onClick}>
      Sample popover button
    </button>
  )

  return (
    <Popover
      buttonElement={sampleButtonElement}
    >
      <StatusItems
        statusItems={statusItems}
        limit={numberOfStatusesToDisplay}
        height='20rem'
      />
      {statusItems.length > MAX_UPDATES_TO_SHOW_DEFAULT && (
        <button
          className={classNames('button-link', 't-tiny')}
          type='button'
          onClick={onShowHideStatusesToggled}
        >
          {showingAllStatuses
            ? 'Show only recent status updates'
            : 'Show all status updates'}
        </button>
      )}
    </Popover>)
}

export default PopoverWrapper
