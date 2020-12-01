import React from 'react'

import PropTypes from 'prop-types'

import { toRem } from 'utils/cssUtils'

const DEFAULT_ICON_SIZE_REM = '1.5rem'

const getSizeStyle = (sizeRem) => ({
  width: sizeRem,
  height: sizeRem
})

const ICON_STYLE_REGULAR = getSizeStyle(DEFAULT_ICON_SIZE_REM)
const ICON_STYLE_MEDIUM = getSizeStyle('1rem')
const ICON_STYLE_SMALL = getSizeStyle('.75rem')
const ICON_STYLE_TINY = getSizeStyle('.5rem')

const getCustomSizeStyle = (customSize) => {
  let customSizeRem = toRem(customSize)

  if (customSizeRem === null) {
    console.error(`Invalid size value: ${customSize}`)
    customSizeRem = DEFAULT_ICON_SIZE_REM
  }

  return getSizeStyle(customSizeRem)
}

const getBasicSizeStyle = (size) => {
  switch (size) {
    case 'default':
      return ICON_STYLE_REGULAR
    case 'small':
      return ICON_STYLE_SMALL
    case 'medium':
      return ICON_STYLE_MEDIUM
    case 'tiny':
      return ICON_STYLE_TINY
  }
}

const StyledIcon = ({ size = 'default', customSizeRem = null, customFill = null, icon }) => {
  const fillStyle = customFill && { fill: customFill }
  const style = {
    ...(customSizeRem ? getCustomSizeStyle(customSizeRem) : getBasicSizeStyle(size)),
    ...fillStyle
  }
  return (
    <svg style={style}>
      <use style={fillStyle} xlinkHref={`#i-${icon}`} />
    </svg>
  )
}

StyledIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['default', 'small', 'medium', 'tiny']),
  customSizeRem: PropTypes.string,
  customFill: PropTypes.string
}

export default StyledIcon
