import React, { useState } from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import apiService from 'apiService'
import { COLORS } from 'components/atoms/colors'
import StyledIcon from 'components/atoms/StyledIcon'
import StatusItems from 'components/molecules/lease_up_sidebar/StatusItems'
import Popover from 'components/molecules/Popover'

import Loading from '../molecules/Loading'

const MAX_UPDATES_TO_SHOW_DEFAULT = 4

const StatusHistoryPopover = ({ applicationId, customButtonClasses = null }) => {
  const [showingAllStatuses, setShowingAllStatuses] = useState(false)
  const [state, setState] = useState({ statusItems: [], loading: false })

  const onShowHideStatusesToggled = () => setShowingAllStatuses(!showingAllStatuses)

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

  const showShowMoreToggler = state.statusItems.length > MAX_UPDATES_TO_SHOW_DEFAULT
  return (
    <Popover
      buttonElement={({ onClick, ref }) => (
        <button
          ref={ref}
          onClick={onClick}
          className={classNames(customButtonClasses, 'button-icon-only')}
        >
          <StyledIcon icon='list-unordered' customSizeRem='1.2rem' customFill={COLORS.steel} />
        </button>
      )}
      onButtonClick={onClick}
    >
      <Loading isLoading={state.loading}>
        <StatusItems
          statusItems={state.statusItems}
          limit={numberOfStatusesToDisplay}
          height={showShowMoreToggler ? '20rem' : null}
        />
        {showShowMoreToggler && (
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
  applicationId: PropTypes.string.isRequired,
  customButtonClasses: PropTypes.string
}

export default StatusHistoryPopover
