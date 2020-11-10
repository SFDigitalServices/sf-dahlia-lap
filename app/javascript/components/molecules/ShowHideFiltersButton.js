import React from 'react'

import PropTypes from 'prop-types'

import Button from '../atoms/Button'
import StyledIcon from '../atoms/StyledIcon'

const getNumFiltersAppliedIcon = (numFiltersApplied) => {
  if (numFiltersApplied < 0 || numFiltersApplied > 9) {
    console.error(`Cannot display a number > 9 or < 0 in filter bubble: ${numFiltersApplied}`)
    numFiltersApplied = 9
  }

  return <StyledIcon icon={`filter-qty--${numFiltersApplied}`} />
}

const ShowHideFiltersButton = ({
  isShowingFilters = false,
  numFiltersApplied = 0,
  onClick = () => {}
}) => {
  const showFiltersCount = numFiltersApplied > 0
  return (
    <Button
      iconLeft={<StyledIcon icon='list-unordered' customSizeRem='1.25rem' />}
      iconRight={showFiltersCount ? getNumFiltersAppliedIcon(numFiltersApplied) : null}
      text={isShowingFilters ? 'Hide Filters' : 'Show Filters'}
      tightPadding
      // Set a min width so that there is no jitter when toggling between
      // show and hide text
      minWidthPx={showFiltersCount ? '236px' : '195px'}
      onClick={onClick}
    />
  )
}

ShowHideFiltersButton.propTypes = {
  isShowingFilters: PropTypes.bool,
  numFiltersApplied: PropTypes.number,
  onClick: PropTypes.func
}

export default ShowHideFiltersButton
