import React from 'react'
import PropTypes from 'prop-types'

const getSizeStyle = (sizeRem) => ({
  width: sizeRem,
  height: sizeRem
})

const ICON_STYLE_REGULAR = getSizeStyle('1.5rem')
const ICON_STYLE_MEDIUM = getSizeStyle('1rem')
const ICON_STYLE_SMALL = getSizeStyle('.75rem')
const ICON_STYLE_TINY = getSizeStyle('.5rem')

const getIconStyle = (size) => {
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

const StyledIcon = ({ size = 'default', icon }) => (
  <svg style={getIconStyle(size)}>
    <use xlinkHref={`#i-${icon}`} />
  </svg>
)

StyledIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['default', 'small', 'medium', 'tiny'])
}

export default StyledIcon
