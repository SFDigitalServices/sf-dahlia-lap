import React from 'react'
import PropTypes from 'prop-types'
import Button from '../atoms/Button'
import StyledIcon from '../atoms/StyledIcon'

const buttonStyle = (hasTwoIcons) => ({
  minWidth: hasTwoIcons ? '236px' : '200px'
})

const getNumFiltersAppliedIcon = (numFiltersApplied) => {
  if (numFiltersApplied < 0 || numFiltersApplied > 9) {
    console.error(`Cannot display a number > 9 or < 0 in filter bubble: ${numFiltersApplied}`)
    numFiltersApplied = 9
  }

  return <StyledIcon icon={`filter-qty--${numFiltersApplied}`} />
}

const ShowHideFiltersButton = ({ isShowingFilters = false, numFiltersApplied = 0 }) => {
  const showFiltersCount = numFiltersApplied > 0
  return (
    <Button
      iconLeft={<StyledIcon icon='list-unordered' customSizeRem='1.25rem' />}
      iconRight={showFiltersCount ? getNumFiltersAppliedIcon(numFiltersApplied) : null}
      text={isShowingFilters ? 'Hide Filters' : 'Show Filters'}
      tightPadding
      tightPaddingVertical
      style={buttonStyle(showFiltersCount)}
    />
  )
}

ShowHideFiltersButton.propTypes = {
  isShowingFilters: PropTypes.bool,
  numFiltersApplied: PropTypes.number
}

export default ShowHideFiltersButton
