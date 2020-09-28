import React from 'react'

import Popover from '~/components/molecules/Popover'
import StatusItems from '~/components/molecules/lease_up_sidebar/StatusItems'

const PopoverWrapper = ({ statusItems }) => {
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
        limit={4}
      />
    </Popover>)
}

export default PopoverWrapper
