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
  const [state, setState] = useState({ statusItems: [], loading: false })

  const fetchStatusHistory = () => {
    setState({ statusItems: state.statusItems, loading: true })
    apiService
      .getFieldUpdateComments(applicationId)
      .then((items) => setState({ statusItems: items, loading: false }))
      .catch(() => setState({ statusItems: state.statusItems, loading: false }))
  }

  const onClick = () => {
    state.statusItems.length === 0 && fetchStatusHistory()
  }

  const numberOfStatusesToDisplay = showingAllStatuses
    ? state.statusItems.length
    : MAX_UPDATES_TO_SHOW_DEFAULT

  return (
    <Popover buttonElement={StatusIconButton} onButtonClick={onClick}>
      <Loading isLoading={state.loading}>
        <StatusItems
          statusItems={state.statusItems}
          limit={numberOfStatusesToDisplay}
          height='20rem'
        />
        {state.statusItems.length > MAX_UPDATES_TO_SHOW_DEFAULT && (
          <button
            className={classNames('button-link', 't-tiny')}
            type='button'
            onClick={onShowHideStatusesToggled}
          >
            {showingAllStatuses ? 'Show only recent status updates' : 'Show all status updates'}
          </button>
        )}
      </Loading>
    </Popover>
  )
}
StatusHistoryPopover.propTypes = {
  applicationId: PropTypes.string.isRequired
}

export default StatusHistoryPopover
