import React from 'react'

import { PropTypes } from 'prop-types'

import { COLORS } from 'components/atoms/colors'
import StyledIcon from 'components/atoms/StyledIcon'
import {
  isConfirmedPreference,
  isInvalidPreference,
  VALIDATION_CONFIRMED,
  VALIDATION_INVALID,
  VALIDATION_UNCONFIRMED
} from 'components/lease_ups/application_page/preferenceValidationUtils'

const getCellContainerStyle = (hasIcon) => ({
  width: '100%',
  display: 'flex',
  justifyContent: hasIcon ? 'space-between' : 'flex-start',
  alignItems: 'center'
})

const PreferenceRankCell = ({ preferenceRank, preferenceValidation }) => {
  const showXIcon = isInvalidPreference(preferenceValidation)
  const showCheckIcon = isConfirmedPreference(preferenceValidation)
  const showAnyIcon = showXIcon || showCheckIcon

  return (
    <div style={getCellContainerStyle(showAnyIcon)}>
      {preferenceRank}
      {showAnyIcon && <>&nbsp;</>}
      {showXIcon && <StyledIcon icon='close' size='medium' customFill={COLORS.alert} />}
      {showCheckIcon && (
        <StyledIcon icon='check' customSizeRem='1.25rem' customFill={COLORS.success} />
      )}
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
