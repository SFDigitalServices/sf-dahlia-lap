import React from 'react'

import { PropTypes } from 'prop-types'

import { COLORS } from 'components/atoms/colors'
import StyledIcon from 'components/atoms/StyledIcon'

export const VALIDATION_CONFIRMED = 'Confirmed'
export const VALIDATION_UNCONFIRMED = 'Unconfirmed'
export const VALIDATION_INVALID = 'Invalid'

const cellContainerStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center'
}

const textStyle = {
  minWidth: '60px',
  paddingRight: '0.5rem'
}

const PreferenceRankCell = ({
  preferenceRank,
  preferenceValidation = VALIDATION_UNCONFIRMED,
  loading = false
}) => {
  const showXIcon = preferenceValidation === VALIDATION_INVALID
  const showCheckIcon = preferenceValidation === VALIDATION_CONFIRMED

  return (
    <div style={cellContainerStyle}>
      <div style={textStyle}>{preferenceRank}</div>
      {showXIcon && (
        <StyledIcon
          icon='close'
          size='medium'
          customFill={COLORS.alert}
          dataTestId={'preference-rank-x-icon'}
        />
      )}
      {showCheckIcon && (
        <StyledIcon
          icon='check'
          customSizeRem='1.25rem'
          customFill={COLORS.success}
          dataTestId={'preference-rank-check-icon'}
        />
      )}
      {loading && <span className='rank-loader' />}
    </div>
  )
}

PreferenceRankCell.propTypes = {
  preferenceRank: PropTypes.string.isRequired,
  preferenceValidation: PropTypes.oneOf([
    VALIDATION_CONFIRMED,
    VALIDATION_UNCONFIRMED,
    VALIDATION_INVALID
  ])
}

export default PreferenceRankCell
