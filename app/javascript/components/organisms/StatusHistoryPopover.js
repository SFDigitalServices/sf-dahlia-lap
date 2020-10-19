import React, { useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import Icon from '~/components/atoms/Icon'
import Popover from '~/components/molecules/Popover'
import StatusItems from '~/components/molecules/lease_up_sidebar/StatusItems'
import Loading from '../molecules/Loading'
import apiService from '~/apiService'

const MAX_UPDATES_TO_SHOW_DEFAULT = 4
const StatusHistoryPopover = ({ applicationId }) => {
  const [showingAllStatuses, setShowingAllStatuses] = useState(false)
  const onShowHideStatusesToggled = () => setShowingAllStatuses(!showingAllStatuses)

  const StatusIconButton = ({ onClick, ref }) => (
    <button ref={ref} onClick={onClick} className='tiny icon margin-left--half'>
      <Icon icon='list-unordered' size='medium' />
    </button>
  )
  const [data, setData] = useState({ statusItems: [], loading: false })

  const fetchStatusHistory = async () => {
    try {
      setData({ statusItems: data.statusItems, loading: true })
      const items = await apiService.getFieldUpdateComments(applicationId)
      setData({ statusItems: items, loading: false })
    } catch (e) {
      setData({ statusItems: data.statusItems, loading: false })
    }
  }

  const onClick = async () => {
    data.statusItems.length === 0 && (await fetchStatusHistory())
  }

  const numberOfStatusesToDisplay = showingAllStatuses
    ? data.statusItems.length
    : MAX_UPDATES_TO_SHOW_DEFAULT

  return (
    <Popover buttonElement={StatusIconButton} onButtonClick={onClick}>
      {data.loading ? (
        <Loading isLoading />
      ) : (
        <>
          <StatusItems
            statusItems={data.statusItems}
            limit={numberOfStatusesToDisplay}
            height='20rem'
          />
          {data.statusItems.length > MAX_UPDATES_TO_SHOW_DEFAULT && (
            <button
              className={classNames('button-link', 't-tiny')}
              type='button'
              onClick={onShowHideStatusesToggled}
            >
              {showingAllStatuses ? 'Show only recent status updates' : 'Show all status updates'}
            </button>
          )}
        </>
      )}
    </Popover>
  )
}
StatusHistoryPopover.propTypes = {
  applicationId: PropTypes.string.isRequired
}

export default StatusHistoryPopover
